import crypto from 'crypto';
import GovtRegistry from '../models/GovtRegistry.js';

// Verhoeff algorithm multiplication table
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Verhoeff algorithm permutation table
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Calculates Verhoeff check digit for a string of digits.
 */
export function generateVerhoeffCheckDigit(digits) {
  let c = 0;
  const ArrayReversed = digits.split('').reverse().map(Number);
  for (let i = 0; i < ArrayReversed.length; i++) {
    c = d[c][p[(i + 1) % 8][ArrayReversed[i]]];
  }
  return inv[c];
}

/**
 * Validates an Aadhaar number using the Verhoeff checksum algorithm.
 * @param {string} aadharNumber 12-digit string
 * @returns {boolean}
 */
export function validateAadhaarVerhoeff(aadharNumber) {
  if (!aadharNumber || typeof aadharNumber !== 'string') return false;
  const clean = aadharNumber.replace(/\s+/g, '');
  if (!/^\d{12}$/.test(clean)) return false;

  let c = 0;
  const ArrayReversed = clean.split('').reverse().map(Number);

  for (let i = 0; i < ArrayReversed.length; i++) {
    c = d[c][p[i % 8][ArrayReversed[i]]];
  }

  return c === 0;
}

/**
 * Hashes Aadhaar number and extracts last 4 digits for data privacy compliance.
 * @param {string} aadharNumber 
 * @returns {{ aadharHash: string, aadharLast4: string }}
 */
export function hashAadhaar(aadharNumber) {
  const clean = aadharNumber.replace(/\s+/g, '');
  const aadharHash = crypto.createHash('sha256').update(clean).digest('hex');
  const aadharLast4 = clean.slice(-4);
  return { aadharHash, aadharLast4 };
}

/**
 * Simulated verification of Hospital License & Government Registration ID.
 */
export async function verifyHospitalLicense(licenseNumber, govtRegId) {
  if (!licenseNumber || !govtRegId) {
    return { valid: false, status: 'rejected', message: 'License number and Govt Reg ID are required.' };
  }

  const record = await GovtRegistry.findOne({ 
    licenseNumber: licenseNumber.trim().toUpperCase(), 
    govtRegId: govtRegId.trim().toUpperCase() 
  });

  if (record && record.status === 'VALID') {
    return { valid: true, status: 'verified', message: 'Hospital license verified against government registry.' };
  }

  const isValidFormat = /^LIC-\d{4}-\d{5}$/i.test(licenseNumber.trim()) || licenseNumber.trim().startsWith('KA-');
  if (isValidFormat) {
    return { valid: true, status: 'verified', message: 'License verified via simulated regulatory lookup.' };
  }

  return { valid: false, status: 'pending', message: 'License submission recorded under manual registry verification.' };
}
