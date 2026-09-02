import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import DonorProfile from './models/DonorProfile.js';
import Hospital from './models/Hospital.js';
import BloodRequest from './models/BloodRequest.js';
import GovtRegistry from './models/GovtRegistry.js';
import { hashAadhaar } from './services/verificationService.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eraktkosh_db';

export async function seedDatabase() {
  // Only seed if database is completely empty (first run only)
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('ℹ️ Database already has data — skipping seed.');
    return;
  }

  console.log('🌱 Starting eRaktKosh Seed Data Insertion...');

  // Clear existing collections (safe since we confirmed empty above)
  await User.deleteMany({});
  await DonorProfile.deleteMany({});
  await Hospital.deleteMany({});
  await BloodRequest.deleteMany({});
  await GovtRegistry.deleteMany({});


  const salt = await bcrypt.genSalt(10);
  // Passwords match 1-Click Demo Login buttons in the frontend
  const hospitalPass = await bcrypt.hash('Hospital@123', salt);
  const donorPass = await bcrypt.hash('Donor@123', salt);
  const bankPass = await bcrypt.hash('Bank@123', salt);
  const adminPass = await bcrypt.hash('Admin@123', salt);
  const genericPass = await bcrypt.hash('password123', salt);


  // 1. Seed Government Registry for Hospital License Simulation
  await GovtRegistry.insertMany([
    { licenseNumber: 'LIC-2026-10001', govtRegId: 'KA-GOVT-001', hospitalName: 'City General Hospital', state: 'Karnataka', status: 'VALID' },
    { licenseNumber: 'LIC-2026-10002', govtRegId: 'KA-GOVT-002', hospitalName: 'Metro Health Care', state: 'Karnataka', status: 'VALID' },
    { licenseNumber: 'LIC-2026-10003', govtRegId: 'KA-GOVT-003', hospitalName: 'St. Johns Medical Center', state: 'Karnataka', status: 'VALID' },
    { licenseNumber: 'LIC-2026-10004', govtRegId: 'KA-GOVT-004', hospitalName: 'Apollo Emergency Center', state: 'Karnataka', status: 'VALID' }
  ]);

  // 2. Seed Hospital Admin Users & Hospitals
  const hospitalsData = [
    {
      name: 'City General Hospital',
      adminName: 'Dr. Ramesh Kumar',
      email: 'admin.city@hospital.org',
      phone: '9876543210',
      licenseNumber: 'LIC-2026-10001',
      govtRegId: 'KA-GOVT-001',
      coordinates: [77.5946, 12.9716], // MG Road Bangalore
      inventory: [
        { bloodGroup: 'A+', units: 12 },
        { bloodGroup: 'B+', units: 2 }, // Low stock for demo!
        { bloodGroup: 'O+', units: 15 },
        { bloodGroup: 'O-', units: 0 }, // Out of stock for demo!
        { bloodGroup: 'AB+', units: 5 }
      ]
    },
    {
      name: 'Metro Health Care',
      adminName: 'Dr. Ananya Sharma',
      email: 'admin.metro@hospital.org',
      phone: '9876543211',
      licenseNumber: 'LIC-2026-10002',
      govtRegId: 'KA-GOVT-002',
      coordinates: [77.6070, 12.9352], // Koramangala Bangalore (~4km away)
      inventory: [
        { bloodGroup: 'A+', units: 20 },
        { bloodGroup: 'B+', units: 18 }, // Stock available for H2H transfer!
        { bloodGroup: 'O+', units: 25 },
        { bloodGroup: 'O-', units: 4 },
        { bloodGroup: 'AB+', units: 8 }
      ]
    },
    {
      name: 'St. Johns Medical Center',
      adminName: 'Dr. Joseph Dsouza',
      email: 'admin.stjohns@hospital.org',
      phone: '9876543212',
      licenseNumber: 'LIC-2026-10003',
      govtRegId: 'KA-GOVT-003',
      coordinates: [77.6245, 12.9312], // HSR Layout (~6km away)
      inventory: [
        { bloodGroup: 'A+', units: 8 },
        { bloodGroup: 'B+', units: 10 },
        { bloodGroup: 'O+', units: 12 },
        { bloodGroup: 'O-', units: 2 },
        { bloodGroup: 'AB-', units: 3 }
      ]
    }
  ];

  const createdHospitals = [];

  for (const item of hospitalsData) {
    const adminUser = new User({
      name: item.adminName,
      phone: item.phone,
      email: item.email,
      passwordHash: hospitalPass,
      role: 'hospitalAdmin',
      verificationStatus: 'verified',
      location: { type: 'Point', coordinates: item.coordinates }
    });
    await adminUser.save();

    const hospital = new Hospital({
      name: item.name,
      licenseNumber: item.licenseNumber,
      govtRegId: item.govtRegId,
      adminId: adminUser._id,
      verificationStatus: 'verified',
      location: { type: 'Point', coordinates: item.coordinates },
      inventory: item.inventory.map(inv => ({ ...inv, lastUpdated: new Date() }))
    });
    await hospital.save();
    createdHospitals.push(hospital);
  }

  // 3. Seed Individual Donors
  const donorsData = [
    { name: 'Rahul Verma', phone: '9900112233', email: 'rahul.donor@gmail.com', group: 'O-', coords: [77.5980, 12.9680], aadhar: '999988887777', score: 95 },
    { name: 'Priya Sundaram', phone: '9900112234', email: 'priya.donor@gmail.com', group: 'B+', coords: [77.6050, 12.9400], aadhar: '888877776666', score: 90 },
    { name: 'Vikram Patel', phone: '9900112235', email: 'vikram.donor@gmail.com', group: 'A+', coords: [77.6150, 12.9300], aadhar: '777766665555', score: 88 },
    { name: 'Sneha Reddy', phone: '9900112236', email: 'sneha.donor@gmail.com', group: 'O+', coords: [77.5900, 12.9750], aadhar: '666655554444', score: 92 },
    { name: 'Amitabh Joshi', phone: '9900112237', email: 'amitabh.donor@gmail.com', group: 'AB+', coords: [77.6300, 12.9200], aadhar: '555544443333', score: 85 }
  ];

  for (const item of donorsData) {
    const { aadharHash, aadharLast4 } = hashAadhaar(item.aadhar);
    const donorUser = new User({
      name: item.name,
      phone: item.phone,
      email: item.email,
      passwordHash: donorPass,
      role: 'donor',
      aadharHash,
      aadharLast4,
      verificationStatus: 'verified',
      location: { type: 'Point', coordinates: item.coords }
    });
    await donorUser.save();

    await DonorProfile.create({
      userId: donorUser._id,
      bloodGroup: item.group,
      availability: true,
      eligibleFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Eligible now
      reliabilityScore: item.score
    });
  }

  // 4. Seed Receiver User (Patient Attendant)
  const { aadharHash: rHash, aadharLast4: rLast4 } = hashAadhaar('123456789012');
  const receiverUser = new User({
    name: 'Kavita Menon (Patient Attendant)',
    phone: '9888777666',
    email: 'kavita.receiver@gmail.com',
    passwordHash: genericPass,
    role: 'receiver',
    aadharHash: rHash,
    aadharLast4: rLast4,
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.5960, 12.9700] }
  });
  await receiverUser.save();

  // 5. Seed 1-Click Demo Login Users (matching frontend buttons)
  const demoHospital = new User({
    name: 'Metro General Hospital',
    email: 'hospital@metro.org',
    passwordHash: hospitalPass,
    role: 'hospitalAdmin',
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] }
  });
  await demoHospital.save();
  await Hospital.create({
    name: 'Metro General Hospital',
    licenseNumber: 'LIC-2026-99001',
    govtRegId: 'KA-GOVT-099',
    adminId: demoHospital._id,
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    inventory: [
      { bloodGroup: 'A+', units: 10, lastUpdated: new Date() },
      { bloodGroup: 'B+', units: 8, lastUpdated: new Date() },
      { bloodGroup: 'O+', units: 20, lastUpdated: new Date() },
      { bloodGroup: 'AB+', units: 4, lastUpdated: new Date() },
      { bloodGroup: 'O-', units: 2, lastUpdated: new Date() }
    ]
  });

  const demoDonor = new User({
    name: 'Demo Donor',
    email: 'donor@example.com',
    passwordHash: donorPass,
    role: 'donor',
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.5980, 12.9680] }
  });
  await demoDonor.save();
  await DonorProfile.create({
    userId: demoDonor._id,
    bloodGroup: 'O+',
    availability: true,
    reliabilityScore: 90
  });

  const demoAdmin = new User({
    name: 'Chief Admin',
    email: 'admin@bloodbridge.ai',
    passwordHash: adminPass,
    role: 'admin',
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] }
  });
  await demoAdmin.save();

  const demoBloodBank = new User({
    name: 'Red Cross Blood Bank',
    email: 'bloodbank@redcross.org',
    passwordHash: bankPass,
    role: 'bloodBank',
    verificationStatus: 'verified',
    location: { type: 'Point', coordinates: [77.6070, 12.9352] }
  });
  await demoBloodBank.save();

  // 5. Seed Sample Active Blood Request
  await BloodRequest.create({
    requesterId: receiverUser._id,
    hospitalId: createdHospitals[0]._id, // City General Hospital
    bloodGroup: 'B+',
    unitsNeeded: 3,
    unitsFulfilled: 0,
    urgency: 'critical',
    status: 'open',
    notes: 'Emergency accident response surgery'
  });

  console.log('✅ Seed dataset successfully populated!');
}

if (process.argv[1] && process.argv[1].includes('seed.js')) {
  mongoose.connect(MONGODB_URI).then(async () => {
    await seedDatabase();
    process.exit(0);
  }).catch(err => {
    console.error('Seed DB connection error:', err);
    process.exit(1);
  });
}
