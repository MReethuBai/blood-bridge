import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import DonorProfile from '../models/DonorProfile.js';
import Hospital from '../models/Hospital.js';
import { generateToken, authGuard } from '../middleware/authGuard.js';
import { validateAadhaarVerhoeff, hashAadhaar, verifyHospitalLicense } from '../services/verificationService.js';

const router = express.Router();

// User Signup
router.post('/register', async (req, res) => {
  try {
    const { 
      name, phone, email, password, role, 
      aadharNumber, bloodGroup,
      hospitalName, licenseNumber, govtRegId,
      latitude, longitude 
    } = req.body;

    // Check existing
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Aadhaar Verification if provided
    let aadharHash = null;
    let aadharLast4 = null;
    let verificationStatus = 'verified';

    if (role === 'donor' || role === 'receiver') {
      if (!aadharNumber) {
        return res.status(400).json({ message: 'Aadhaar number is required for donors and receivers.' });
      }
      const isValid = validateAadhaarVerhoeff(aadharNumber);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid 12-digit Aadhaar number (failed Verhoeff checksum).' });
      }
      const hashed = hashAadhaar(aadharNumber);
      aadharHash = hashed.aadharHash;
      aadharLast4 = hashed.aadharLast4;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const coordinates = [
      longitude ? parseFloat(longitude) : 77.5946, 
      latitude ? parseFloat(latitude) : 12.9716
    ];

    const user = new User({
      name,
      phone,
      email,
      passwordHash,
      role,
      aadharHash,
      aadharLast4,
      verificationStatus,
      location: { type: 'Point', coordinates }
    });

    await user.save();

    // Role-specific setup
    if (role === 'donor') {
      await DonorProfile.create({
        userId: user._id,
        bloodGroup: bloodGroup || 'O+',
        availability: true,
        reliabilityScore: 90
      });
    } else if (role === 'hospitalAdmin') {
      const hCheck = await verifyHospitalLicense(licenseNumber || 'LIC-2026-10001', govtRegId || 'KA-GOVT-001');
      
      const hospital = new Hospital({
        name: hospitalName || `${name}'s Medical Center`,
        licenseNumber: licenseNumber || `LIC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        govtRegId: govtRegId || `KA-GOVT-${Math.floor(100 + Math.random() * 900)}`,
        adminId: user._id,
        verificationStatus: hCheck.status,
        location: { type: 'Point', coordinates },
        inventory: [
          { bloodGroup: 'A+', units: 10, lastUpdated: new Date() },
          { bloodGroup: 'B+', units: 15, lastUpdated: new Date() },
          { bloodGroup: 'O+', units: 20, lastUpdated: new Date() },
          { bloodGroup: 'AB+', units: 5, lastUpdated: new Date() },
          { bloodGroup: 'O-', units: 3, lastUpdated: new Date() }
        ]
      });
      await hospital.save();
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    let profile = null;
    let hospital = null;

    if (user.role === 'donor') {
      profile = await DonorProfile.findOne({ userId: user._id });
    } else if (user.role === 'hospitalAdmin') {
      hospital = await Hospital.findOne({ adminId: user._id });
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verificationStatus: user.verificationStatus,
        location: user.location,
        aadharLast4: user.aadharLast4
      },
      profile,
      hospital
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Get Current User Profile
router.get('/me', authGuard, async (req, res) => {
  try {
    let profile = null;
    let hospital = null;

    if (req.user.role === 'donor') {
      profile = await DonorProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === 'hospitalAdmin') {
      hospital = await Hospital.findOne({ adminId: req.user._id });
    }

    res.json({
      user: req.user,
      profile,
      hospital
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Validate Aadhaar (Simulation Endpoint)
router.post('/verify-aadhaar', (req, res) => {
  const { aadharNumber } = req.body;
  const isValid = validateAadhaarVerhoeff(aadharNumber);
  if (!isValid) {
    return res.status(400).json({ valid: false, message: 'Invalid 12-digit Aadhaar number (failed Verhoeff checksum).' });
  }
  const { aadharHash, aadharLast4 } = hashAadhaar(aadharNumber);
  res.json({
    valid: true,
    message: 'Aadhaar validated successfully via Verhoeff checksum.',
    aadharHash,
    aadharLast4
  });
});

export default router;
