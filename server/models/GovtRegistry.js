import mongoose from 'mongoose';

const govtRegistrySchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true, unique: true },
  govtRegId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  state: { type: String, default: 'Karnataka' },
  status: { type: String, enum: ['VALID', 'EXPIRED', 'SUSPENDED'], default: 'VALID' }
}, { timestamps: true });

export default mongoose.model('GovtRegistry', govtRegistrySchema);
