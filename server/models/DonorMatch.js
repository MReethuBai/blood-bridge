import mongoose from 'mongoose';

const donorMatchSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchScore: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['notified', 'accepted', 'declined', 'expired', 'donated'], 
    default: 'notified' 
  },
  notifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('DonorMatch', donorMatchSchema);
