import mongoose from 'mongoose';

const donorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  lastDonationDate: { type: Date, default: null },
  eligibleFrom: { type: Date, default: Date.now },
  availability: { type: Boolean, default: true },
  reliabilityScore: { type: Number, default: 85, min: 0, max: 100 }
}, { timestamps: true });

export default mongoose.model('DonorProfile', donorProfileSchema);
