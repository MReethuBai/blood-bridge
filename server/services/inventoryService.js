import Hospital from '../models/Hospital.js';

/**
 * Atomically deduct blood units from hospital inventory if sufficient units are present.
 * Uses guarded atomic update `updateOne({_id, 'inventory.bloodGroup': group, 'inventory.units': {$gte: units}}, ...)`
 * 
 * @param {string} hospitalId 
 * @param {string} bloodGroup 
 * @param {number} unitsNeeded 
 * @returns {Promise<boolean>} True if update succeeded, False if insufficient stock / race condition lost.
 */
export async function deductInventoryAtomic(hospitalId, bloodGroup, unitsNeeded) {
  const result = await Hospital.updateOne(
    { 
      _id: hospitalId,
      'inventory.bloodGroup': bloodGroup,
      'inventory.units': { $gte: unitsNeeded }
    },
    { 
      $inc: { 'inventory.$.units': -unitsNeeded },
      $set: { 'inventory.$.lastUpdated': new Date() }
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Atomically add blood units to hospital inventory.
 * 
 * @param {string} hospitalId 
 * @param {string} bloodGroup 
 * @param {number} units 
 * @returns {Promise<boolean>}
 */
export async function addInventoryAtomic(hospitalId, bloodGroup, units) {
  // First check if blood group item exists in inventory array
  const existing = await Hospital.findOne({
    _id: hospitalId,
    'inventory.bloodGroup': bloodGroup
  });

  if (existing) {
    const result = await Hospital.updateOne(
      { _id: hospitalId, 'inventory.bloodGroup': bloodGroup },
      { 
        $inc: { 'inventory.$.units': units },
        $set: { 'inventory.$.lastUpdated': new Date() }
      }
    );
    return result.modifiedCount > 0;
  } else {
    const result = await Hospital.updateOne(
      { _id: hospitalId },
      { 
        $push: { 
          inventory: { 
            bloodGroup, 
            units, 
            lastUpdated: new Date() 
          } 
        } 
      }
    );
    return result.modifiedCount > 0;
  }
}
