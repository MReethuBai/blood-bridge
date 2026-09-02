import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import DonorProfile from '../models/DonorProfile.js';
import BloodRequest from '../models/BloodRequest.js';

// Universal Donor / Recipient Compatibility Matrix
// Key = Recipient Blood Group, Value = Array of Compatible Donor Blood Groups
export const COMPATIBILITY_MATRIX = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor
};

/**
 * Calculates distance in kilometers between two lat/lng coordinates (Haversine formula).
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Tier 0: Self-Check hospital's own inventory.
 * @param {string} hospitalId 
 * @param {string} bloodGroup 
 * @param {number} unitsNeeded 
 * @returns {Promise<{ covered: boolean, availableUnits: number, bloodGroupUsed: string }>}
 */
export async function performTier0SelfCheck(hospitalId, bloodGroup, unitsNeeded) {
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) return { covered: false, availableUnits: 0, bloodGroupUsed: bloodGroup };

  const compatibleGroups = COMPATIBILITY_MATRIX[bloodGroup] || [bloodGroup];
  let totalAvailable = 0;
  let selectedGroup = bloodGroup;

  for (const item of hospital.inventory) {
    if (compatibleGroups.includes(item.bloodGroup)) {
      totalAvailable += item.units;
      if (item.units >= unitsNeeded) {
        selectedGroup = item.bloodGroup;
        return { covered: true, availableUnits: item.units, bloodGroupUsed: selectedGroup };
      }
    }
  }

  return { 
    covered: totalAvailable >= unitsNeeded, 
    availableUnits: totalAvailable, 
    bloodGroupUsed: selectedGroup 
  };
}

/**
 * Tier 1: Search hospital-to-hospital transfer candidates within radius.
 * @param {string} requestingHospitalId 
 * @param {number[]} coordinates [lng, lat]
 * @param {string} bloodGroup 
 * @param {number} unitsNeeded 
 * @param {number} radiusKm Max radius in kilometers (default 30km)
 * @returns {Promise<Array<{ hospital: object, distanceKm: number, availableUnits: number, compatibleGroup: string }>>}
 */
export async function findTier1HospitalCandidates(requestingHospitalId, coordinates, bloodGroup, unitsNeeded, radiusKm = 30) {
  const compatibleGroups = COMPATIBILITY_MATRIX[bloodGroup] || [bloodGroup];
  const maxDistanceMeters = radiusKm * 1000;

  // GeoNear aggregation search
  const nearbyHospitals = await Hospital.find({
    _id: { $ne: requestingHospitalId },
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistanceMeters
      }
    }
  });

  const candidates = [];

  for (const hospital of nearbyHospitals) {
    const hLng = hospital.location.coordinates[0];
    const hLat = hospital.location.coordinates[1];
    const dist = calculateHaversineDistance(coordinates[1], coordinates[0], hLat, hLng);

    for (const item of hospital.inventory) {
      if (compatibleGroups.includes(item.bloodGroup) && item.units > 0) {
        candidates.push({
          hospital,
          distanceKm: dist,
          availableUnits: item.units,
          compatibleGroup: item.bloodGroup
        });
        break;
      }
    }
  }

  // Sort by distance ASC
  return candidates.sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Tier 2: Search and rank individual donors within radius.
 * Ranking formula: Score = w1*proximity + w2*reliabilityScore + w3*urgencyMultiplier
 * @param {number[]} coordinates [lng, lat]
 * @param {string} bloodGroup 
 * @param {string} urgency 'critical' | 'high' | 'normal'
 * @param {number} radiusKm 
 * @returns {Promise<Array<{ donorUser: object, donorProfile: object, distanceKm: number, score: number }>>}
 */
export async function findAndRankTier2Donors(coordinates, bloodGroup, urgency = 'high', radiusKm = 25) {
  const compatibleDonorGroups = COMPATIBILITY_MATRIX[bloodGroup] || [bloodGroup];
  const maxDistanceMeters = radiusKm * 1000;

  // 1. Find compatible donor profiles who are eligible & available
  const eligibleProfiles = await DonorProfile.find({
    bloodGroup: { $in: compatibleDonorGroups },
    availability: true,
    eligibleFrom: { $lte: new Date() }
  }).populate('userId');

  const urgencyMultiplier = urgency === 'critical' ? 1.3 : (urgency === 'high' ? 1.15 : 1.0);
  const w1 = 0.4; // Proximity weight
  const w2 = 0.4; // Reliability weight
  const w3 = 0.2; // Urgency factor weight

  const rankedDonors = [];

  for (const profile of eligibleProfiles) {
    const user = profile.userId;
    if (!user || user.role !== 'donor' || !user.location || !user.location.coordinates) continue;

    const dLng = user.location.coordinates[0];
    const dLat = user.location.coordinates[1];
    const distanceKm = calculateHaversineDistance(coordinates[1], coordinates[0], dLat, dLng);

    if (distanceKm > radiusKm) continue;

    // Proximity score 0 - 100
    const proximityScore = Math.max(0, 100 - (distanceKm / radiusKm) * 100);
    const reliabilityScore = profile.reliabilityScore || 80;

    const rawScore = (w1 * proximityScore) + (w2 * reliabilityScore) + (w3 * 80 * urgencyMultiplier);
    const finalScore = Math.round(Math.min(100, Math.max(10, rawScore)));

    rankedDonors.push({
      donorUser: user,
      donorProfile: profile,
      distanceKm,
      score: finalScore
    });
  }

  // Sort candidates by final score DESC
  return rankedDonors.sort((a, b) => b.score - a.score);
}
