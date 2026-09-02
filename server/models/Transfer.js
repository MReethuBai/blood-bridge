import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  fromHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  toHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  units: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'completed', 'declined'], 
    default: 'requested' 
  }
}, { timestamps: true });

export default mongoose.model('Transfer', transferSchema);
