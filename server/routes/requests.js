import express from 'express';
import BloodRequest from '../models/BloodRequest.js';
import Hospital from '../models/Hospital.js';
import Transfer from '../models/Transfer.js';
import DonorMatch from '../models/DonorMatch.js';
import DonationRecord from '../models/DonationRecord.js';
import DonorProfile from '../models/DonorProfile.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { 
  performTier0SelfCheck, 
  findTier1HospitalCandidates, 
  findAndRankTier2Donors 
} from '../services/matchingService.js';
import { addInventoryAtomic, deductInventoryAtomic } from '../services/inventoryService.js';
import { emitToUser, emitToHospitalAdmins } from '../sockets/socketHandler.js';

const router = express.Router();

// Create Blood Request (Hospital Admin or Receiver)
router.post('/', authGuard, async (req, res) => {
  try {
    const { bloodGroup, unitsNeeded, urgency, hospitalId, notes } = req.body;
    let targetHospitalId = hospitalId;
    let autoAttached = false;

    // Rule: Receiver-raised requests auto-attach to nearest hospital for validation
    if (req.user.role === 'receiver') {
      if (!targetHospitalId) {
        // Geo query nearest hospital
        const nearestHospital = await Hospital.findOne({
          location: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: req.user.location.coordinates
              }
            }
          }
        });

        if (!nearestHospital) {
          return res.status(400).json({ message: 'No registered hospital found nearby to auto-attach request.' });
        }
        targetHospitalId = nearestHospital._id;
        autoAttached = true;
      }
    } else if (req.user.role === 'hospitalAdmin') {
      if (!targetHospitalId) {
        const adminHospital = await Hospital.findOne({ adminId: req.user._id });
        if (!adminHospital) return res.status(400).json({ message: 'Hospital profile not found for admin' });
        targetHospitalId = adminHospital._id;
      }
    }

    const bloodRequest = new BloodRequest({
      requesterId: req.user._id,
      hospitalId: targetHospitalId,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded) || 1,
      urgency: urgency || 'high',
      status: 'open',
      notes
    });

    await bloodRequest.save();

    // Trigger Two-Tier Cascade Matching
    const cascadeResult = await runTwoTierMatchingCascade(bloodRequest._id);

    res.status(201).json({
      message: autoAttached 
        ? 'Request created and auto-attached to nearest hospital for medical validation.' 
        : 'Request created and matching cascade initiated.',
      request: bloodRequest,
      cascade: cascadeResult
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// Run or Re-trigger Two-Tier Cascade Engine
router.post('/:requestId/match', authGuard, async (req, res) => {
  try {
    const cascadeResult = await runTwoTierMatchingCascade(req.params.requestId);
    res.json(cascadeResult);
  } catch (error) {
    res.status(500).json({ message: 'Error executing matching engine', error: error.message });
  }
});

/**
 * Decoupled function executing Tier 0 -> Tier 1 -> Tier 2 cascade
 */
async function runTwoTierMatchingCascade(requestId) {
  const request = await BloodRequest.findById(requestId)
    .populate('hospitalId')
    .populate('requesterId');

  if (!request || ['fulfilled', 'cancelled', 'archived'].includes(request.status)) {
    return { status: request ? request.status : 'not_found', message: 'Request inactive or completed' };
  }

  const hospital = request.hospitalId;
  const coords = hospital.location.coordinates;
  const unitsRemaining = request.unitsNeeded - request.unitsFulfilled;

  if (unitsRemaining <= 0) {
    request.status = 'fulfilled';
    await request.save();
    return { tier: 0, status: 'fulfilled', message: 'Request already satisfied.' };
  }

  // --- TIER 0: Self-Check ---
  const tier0 = await performTier0SelfCheck(hospital._id, request.bloodGroup, unitsRemaining);
  if (tier0.covered) {
    // Atomically deduct inventory
    const successDeduct = await deductInventoryAtomic(hospital._id, tier0.bloodGroupUsed, unitsRemaining);
    if (successDeduct) {
      request.unitsFulfilled += unitsRemaining;
      request.status = 'fulfilled';
      await request.save();

      return {
        tier: 0,
        status: 'fulfilled',
        message: `Satisfied via Tier 0 hospital self-check inventory (${tier0.bloodGroupUsed}).`
      };
    }
  }

  // --- TIER 1: Hospital-to-Hospital Transfer ---
  const h2hCandidates = await findTier1HospitalCandidates(
    hospital._id, 
    coords, 
    request.bloodGroup, 
    unitsRemaining, 
    30 // 30km radius
  );

  const transferRecords = [];
  let h2hUnitsCovered = 0;

  for (const candidate of h2hCandidates) {
    if (h2hUnitsCovered >= unitsRemaining) break;

    const unitsToTransfer = Math.min(candidate.availableUnits, unitsRemaining - h2hUnitsCovered);
    
    // Create Transfer record
    const transfer = new Transfer({
      requestId: request._id,
      fromHospitalId: candidate.hospital._id,
      toHospitalId: hospital._id,
      bloodGroup: candidate.compatibleGroup,
      units: unitsToTransfer,
      status: 'requested'
    });
    await transfer.save();
    transferRecords.push(transfer);
    h2hUnitsCovered += unitsToTransfer;

    // Real-time alert to target hospital admin
    if (candidate.hospital.adminId) {
      emitToUser(candidate.hospital.adminId, 'h2h_transfer_alert', {
        transferId: transfer._id,
        requestingHospital: hospital.name,
        bloodGroup: candidate.compatibleGroup,
        unitsNeeded: unitsToTransfer,
        distanceKm: candidate.distanceKm,
        urgency: request.urgency
      });
    }
  }

  if (h2hUnitsCovered >= unitsRemaining) {
    request.status = 'matching';
    await request.save();
    return {
      tier: 1,
      status: 'matching_h2h',
      candidatesCount: h2hCandidates.length,
      transfersInitiated: transferRecords.length,
      message: `Tier 1 H2H transfer alerts dispatched to ${transferRecords.length} nearby hospitals.`
    };
  }

  // --- TIER 2: Individual Donor Matching (Slow path fallback) ---
  const donorCandidates = await findAndRankTier2Donors(
    coords, 
    request.bloodGroup, 
    request.urgency, 
    25 // 25km radius
  );

  const topDonors = donorCandidates.slice(0, 5); // Notify top 5 ranked candidates
  const donorMatchRecords = [];

  for (const item of topDonors) {
    // Check if match record already exists
    let match = await DonorMatch.findOne({ requestId: request._id, donorId: item.donorUser._id });
    if (!match) {
      match = new DonorMatch({
        requestId: request._id,
        donorId: item.donorUser._id,
        matchScore: item.score,
        status: 'notified'
      });
      await match.save();
    }
    donorMatchRecords.push(match);

    // Socket alert to donor
    emitToUser(item.donorUser._id, 'donor_match_alert', {
      matchId: match._id,
      requestId: request._id,
      hospitalName: hospital.name,
      bloodGroup: request.bloodGroup,
      unitsNeeded: unitsRemaining,
      urgency: request.urgency,
      distanceKm: item.distanceKm,
      matchScore: item.score
    });
  }

  request.status = 'matching';
  await request.save();

  return {
    tier: 2,
    status: 'matching_donors',
    h2hCandidatesCount: h2hCandidates.length,
    donorsNotifiedCount: donorMatchRecords.length,
    topDonors: topDonors.map(d => ({
      name: d.donorUser.name,
      distanceKm: d.distanceKm,
      score: d.score
    })),
    message: `Tier 2 Fallback activated: ${donorMatchRecords.length} compatible donors notified.`
  };
}

// Confirm Donor Walk-in Donation (Hospital Admin)
router.post('/:requestId/confirm-donation', authGuard, roleGuard('hospitalAdmin'), async (req, res) => {
  try {
    const { donorId, matchId, units } = req.body;
    const request = await BloodRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const adminHospital = await Hospital.findOne({ adminId: req.user._id });
    if (!adminHospital) return res.status(400).json({ message: 'Hospital profile not found' });

    const unitsDonated = Number(units) || 1;

    // 1. Create permanent DonationRecord audit log
    const donationRecord = new DonationRecord({
      donorId,
      hospitalId: adminHospital._id,
      requestId: request._id,
      units: unitsDonated,
      verifiedBy: req.user._id
    });
    await donationRecord.save();

    // 2. Atomically update hospital inventory
    await addInventoryAtomic(adminHospital._id, request.bloodGroup, unitsDonated);

    // 3. Recalculate donor eligibility cooldown (+90 days) & availability
    const profile = await DonorProfile.findOne({ userId: donorId });
    if (profile) {
      const now = new Date();
      const eligibleFrom = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days cooldown
      profile.lastDonationDate = now;
      profile.eligibleFrom = eligibleFrom;
      profile.availability = false; // Cooldown active
      profile.reliabilityScore = Math.min(100, (profile.reliabilityScore || 85) + 5);
      await profile.save();
    }

    // 4. Update Match Record status
    if (matchId) {
      await DonorMatch.findByIdAndUpdate(matchId, { status: 'donated' });
    }

    // 5. Update Blood Request status
    request.unitsFulfilled += unitsDonated;
    if (request.unitsFulfilled >= request.unitsNeeded) {
      request.status = 'fulfilled';
    } else {
      request.status = 'partially_fulfilled';
    }
    await request.save();

    // Socket alert to donor
    emitToUser(donorId, 'donation_confirmed', {
      hospitalName: adminHospital.name,
      units: unitsDonated,
      nextEligibleDate: profile ? profile.eligibleFrom : null
    });

    res.json({
      message: 'Donation confirmed! Inventory updated and 90-day donor cooldown set.',
      donationRecord,
      requestStatus: request.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming donation', error: error.message });
  }
});

// List all requests with soft-close audit filters
router.get('/', authGuard, async (req, res) => {
  try {
    const { status, hospitalId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (hospitalId) filter.hospitalId = hospitalId;

    if (req.user.role === 'receiver') {
      filter.requesterId = req.user._id;
    } else if (req.user.role === 'hospitalAdmin') {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (hospital) filter.hospitalId = hospital._id;
    }

    const requests = await BloodRequest.find(filter)
      .populate('hospitalId', 'name location licenseNumber')
      .populate('requesterId', 'name phone role')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Get single request details with cascade matches
router.get('/:id', authGuard, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('hospitalId')
      .populate('requesterId', 'name phone email role');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    const transfers = await Transfer.find({ requestId: request._id }).populate('fromHospitalId toHospitalId');
    const donorMatches = await DonorMatch.find({ requestId: request._id }).populate('donorId', 'name phone location');

    res.json({
      request,
      transfers,
      donorMatches
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request details', error: error.message });
  }
});

export default router;
