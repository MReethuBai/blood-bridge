import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  unitsNeeded: { type: Number, required: true, min: 1 },
  unitsFulfilled: { type: Number, default: 0, min: 0 },
  urgency: { 
    type: String, 
    enum: ['critical', 'high', 'normal'], 
    default: 'high' 
  },
  status: { 
    type: String, 
    enum: ['open', 'matching', 'partially_fulfilled', 'fulfilled', 'cancelled', 'archived'], 
    default: 'open' 
  },
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('BloodRequest', bloodRequestSchema);
