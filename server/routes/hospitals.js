import express from 'express';
import Hospital from '../models/Hospital.js';
import Transfer from '../models/Transfer.js';
import BloodRequest from '../models/BloodRequest.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { addInventoryAtomic, deductInventoryAtomic } from '../services/inventoryService.js';
import { emitToUser, broadcastEvent } from '../sockets/socketHandler.js';

const router = express.Router();

// Get all verified hospitals with inventory & location
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('adminId', 'name email phone');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
  }
});

// Get single hospital details & inventory
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('adminId', 'name email phone');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospital', error: error.message });
  }
});

// Update Hospital Inventory (Hospital Admin only)
router.put('/inventory', authGuard, roleGuard('hospitalAdmin'), async (req, res) => {
  try {
    const { bloodGroup, units, action } = req.body; // action: 'set' | 'add' | 'subtract'
    const hospital = await Hospital.findOne({ adminId: req.user._id });

    if (!hospital) return res.status(404).json({ message: 'Hospital profile not found for this admin' });

    if (action === 'add') {
      await addInventoryAtomic(hospital._id, bloodGroup, units);
    } else if (action === 'subtract') {
      const success = await deductInventoryAtomic(hospital._id, bloodGroup, units);
      if (!success) return res.status(400).json({ message: 'Insufficient inventory to deduct requested units.' });
    } else {
      // Set absolute units
      const itemIndex = hospital.inventory.findIndex(item => item.bloodGroup === bloodGroup);
      if (itemIndex > -1) {
        hospital.inventory[itemIndex].units = units;
        hospital.inventory[itemIndex].lastUpdated = new Date();
      } else {
        hospital.inventory.push({ bloodGroup, units, lastUpdated: new Date() });
      }
      await hospital.save();
    }

    const updated = await Hospital.findById(hospital._id);
    broadcastEvent('inventory_updated', { hospitalId: hospital._id, inventory: updated.inventory });

    res.json({ message: 'Inventory updated successfully', inventory: updated.inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
});

// Get incoming/outgoing H2H transfers for hospital
router.get('/transfers/my', authGuard, roleGuard('hospitalAdmin'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ adminId: req.user._id });
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const transfers = await Transfer.find({
      $or: [{ fromHospitalId: hospital._id }, { toHospitalId: hospital._id }]
    })
      .populate('fromHospitalId', 'name location')
      .populate('toHospitalId', 'name location')
      .populate('requestId')
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transfers', error: error.message });
  }
});

// Accept H2H Transfer Request (Hospital Admin acting as supplier)
router.post('/transfers/:transferId/accept', authGuard, roleGuard('hospitalAdmin'), async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.transferId)
      .populate('fromHospitalId')
      .populate('toHospitalId')
      .populate('requestId');

    if (!transfer) return res.status(404).json({ message: 'Transfer request not found' });
    if (transfer.status !== 'requested') {
      return res.status(400).json({ message: `Transfer already ${transfer.status}` });
    }

    const supplierAdminHospital = await Hospital.findOne({ adminId: req.user._id });
    if (!supplierAdminHospital || supplierAdminHospital._id.toString() !== transfer.fromHospitalId._id.toString()) {
      return res.status(403).json({ message: 'Only the requested supplier hospital admin can accept this transfer.' });
    }

    // Atomic conditional inventory deduction: prevent overdrawing
    const successDeduct = await deductInventoryAtomic(
      supplierAdminHospital._id, 
      transfer.bloodGroup, 
      transfer.units
    );

    if (!successDeduct) {
      transfer.status = 'declined';
      await transfer.save();
      return res.status(400).json({ 
        message: 'Insufficient inventory available to complete transfer. Transfer declined automatically.' 
      });
    }

    // Atomic addition to destination hospital
    await addInventoryAtomic(transfer.toHospitalId._id, transfer.bloodGroup, transfer.units);

    transfer.status = 'completed';
    await transfer.save();

    // Update Blood Request status
    const request = await BloodRequest.findById(transfer.requestId._id);
    if (request) {
      request.unitsFulfilled += transfer.units;
      if (request.unitsFulfilled >= request.unitsNeeded) {
        request.status = 'fulfilled';
      } else {
        request.status = 'partially_fulfilled';
      }
      await request.save();
    }

    // Broadcast WebSocket notifications
    emitToUser(transfer.toHospitalId.adminId, 'h2h_transfer_accepted', {
      transferId: transfer._id,
      fromHospital: supplierAdminHospital.name,
      units: transfer.units,
      bloodGroup: transfer.bloodGroup,
      requestStatus: request ? request.status : 'fulfilled'
    });

    broadcastEvent('inventory_updated', { hospitalId: supplierAdminHospital._id });
    broadcastEvent('inventory_updated', { hospitalId: transfer.toHospitalId._id });

    res.json({ 
      message: 'Transfer accepted and completed atomically.', 
      transfer, 
      request 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing transfer acceptance', error: error.message });
  }
});

export default router;
