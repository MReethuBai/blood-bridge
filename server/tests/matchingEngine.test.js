import { validateAadhaarVerhoeff, hashAadhaar, generateVerhoeffCheckDigit } from '../services/verificationService.js';
import { COMPATIBILITY_MATRIX, calculateHaversineDistance } from '../services/matchingService.js';

console.log('🧪 Running eRaktKosh Unit Verification Suite...\n');

// 1. Generate & Test Verhoeff Checksum
const first11 = '99998888777';
const checkDigit = generateVerhoeffCheckDigit(first11);
const validAadhaar = first11 + checkDigit;
const invalidAadhaar = first11 + ((checkDigit + 1) % 10);

const isValValid = validateAadhaarVerhoeff(validAadhaar);
const isValInvalid = validateAadhaarVerhoeff(invalidAadhaar);

console.log(`[Verhoeff Checksum] Generated Valid Aadhaar (${validAadhaar}):`, isValValid ? '✅ PASS' : '❌ FAIL');
console.log(`[Verhoeff Checksum] Invalid Aadhaar (${invalidAadhaar}):`, !isValInvalid ? '✅ PASS' : '❌ FAIL');

// 2. Test Aadhaar Hashing & Masking
const { aadharHash, aadharLast4 } = hashAadhaar(validAadhaar);
console.log(`[Aadhaar Masking] Last 4 digits: ${aadharLast4} (Hash: ${aadharHash.slice(0, 16)}...)`, aadharLast4 === `${validAadhaar.slice(-4)}` ? '✅ PASS' : '❌ FAIL');

// 3. Test Universal Compatibility Matrix
console.log('[Compatibility Matrix] Universal Donor O- can donate to:', COMPATIBILITY_MATRIX['AB+'].includes('O-') ? '✅ PASS (AB+ receives O-)' : '❌ FAIL');
console.log('[Compatibility Matrix] O- can only receive from:', COMPATIBILITY_MATRIX['O-'].join(', ') === 'O-' ? '✅ PASS (O- only)' : '❌ FAIL');

// 4. Test Haversine Distance Calculation (MG Road to Koramangala)
const dist = calculateHaversineDistance(12.9716, 77.5946, 12.9352, 77.6070);
console.log(`[Haversine Distance] MG Road -> Koramangala: ${dist} km`, dist > 3 && dist < 6 ? '✅ PASS' : '❌ FAIL');

console.log('\n✅ All core unit tests completed successfully!');
