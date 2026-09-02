import express from 'express';
import DonorProfile from '../models/DonorProfile.js';
import DonorMatch from '../models/DonorMatch.js';
import DonationRecord from '../models/DonationRecord.js';
import BloodRequest from '../models/BloodRequest.js';
import Hospital from '../models/Hospital.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { emitToUser } from '../sockets/socketHandler.js';

const router = express.Router();

// Toggle Availability & Update Profile
router.put('/profile', authGuard, roleGuard('donor'), async (req, res) => {
  try {
    const { availability, bloodGroup } = req.body;
    const profile = await DonorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Donor profile not found' });

    if (typeof availability === 'boolean') profile.availability = availability;
    if (bloodGroup) profile.bloodGroup = bloodGroup;

    await profile.save();
    res.json({ message: 'Donor profile updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get matches for logged-in donor
router.get('/matches', authGuard, roleGuard('donor'), async (req, res) => {
  try {
    const matches = await DonorMatch.find({ donorId: req.user._id })
      .populate({
        path: 'requestId',
        populate: [
          { path: 'hospitalId', select: 'name location licenseNumber' },
          { path: 'requesterId', select: 'name phone' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
});

// Respond to Match (Accept / Decline) with Atomic Double-Booking Prevention
router.post('/matches/:matchId/respond', authGuard, roleGuard('donor'), async (req, res) => {
  try {
    const { response } = req.body; // 'accepted' | 'declined'
    if (!['accepted', 'declined'].includes(response)) {
      return res.status(400).json({ message: 'Response must be accepted or declined' });
    }

    // Atomic conditional write: findOneAndUpdate({_id: matchId, status: 'notified'})
    // Whichever write lands first wins; other request gets "no longer available".
    const match = await DonorMatch.findOneAndUpdate(
      { _id: req.params.matchId, donorId: req.user._id, status: 'notified' },
      { $set: { status: response } },
      { new: true }
    ).populate({
      path: 'requestId',
      populate: { path: 'hospitalId' }
    });

    if (!match) {
      return res.status(400).json({ 
        message: 'Match request is no longer available or was already responded to.' 
      });
    }

    // If accepted, update blood request state
    if (response === 'accepted') {
      const request = await BloodRequest.findById(match.requestId._id);
      if (request && request.status === 'open') {
        request.status = 'matching';
        await request.save();
      }

      // Notify hospital admin via WebSocket
      const hospitalAdminId = match.requestId.hospitalId?.adminId;
      if (hospitalAdminId) {
        emitToUser(hospitalAdminId, 'donor_accepted_match', {
          matchId: match._id,
          requestId: request._id,
          donorName: req.user.name,
          donorPhone: req.user.phone,
          bloodGroup: request.bloodGroup
        });
      }
    }

    res.json({ message: `Match successfully ${response}`, match });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to match', error: error.message });
  }
});

// View personal donation history
router.get('/donations', authGuard, roleGuard('donor'), async (req, res) => {
  try {
    const records = await DonationRecord.find({ donorId: req.user._id })
      .populate('hospitalId', 'name location')
      .populate('requestId', 'bloodGroup urgency')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation history', error: error.message });
  }
});

export default router;
