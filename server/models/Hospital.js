import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  units: { type: Number, required: true, min: 0, default: 0 },
  expiryDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  govtRegId: { type: String, required: true, trim: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'verified' 
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  inventory: [inventoryItemSchema]
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

export default mongoose.model('Hospital', hospitalSchema);
