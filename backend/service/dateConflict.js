

const Reserves = require('../models/reserves');

async function isDateConflict(startDate, endDate, condoId, areaToReserve) {
    try {
        const conflictingReserves = await Reserves.find({
            $and: [
                { condoId: condoId },
                { areaToReserve: areaToReserve },
                {
                    $or: [
                        {
                            checkIn: { $lt: endDate },
                            checkOut: { $gt: startDate }
                        },
                        {
                            checkIn: { $lt: startDate },
                            checkOut: { $gt: startDate }
                        },
                        {
                            checkIn: { $lt: endDate },
                            checkOut: { $gt: endDate }
                        }
                    ]
                }
            ]
        });
      
        return conflictingReserves;
    } catch (error) {
        console.error('Error checking date conflict:', error);
        throw new Error('Error checking date conflict');
    }
}

module.exports = isDateConflict;