import mongoose from 'mongoose';

const donationRecordSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  date: { type: Date, default: Date.now },
  units: { type: Number, default: 1, required: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('DonationRecord', donationRecordSchema);
