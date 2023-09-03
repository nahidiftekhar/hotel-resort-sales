const { Sequelize, Op } = require('sequelize');
const {
  roomtypes,
  rooms,
  roomreservations,
  venues,
  venuereservations,
} = require('../../database/models');

async function roomStatusMonthWise(startOfMonth, endOfMonth) {
  try {
    const result = roomtypes.findAll({
      attributes: ['room_type_name'],
      include: [
        {
          model: rooms,
          attributes: ['id', 'room_number'],
          where: {
            is_live: true,
          },
          required: false, // Left outer join
          include: [
            {
              model: roomreservations,
              attributes: [
                'reservation_date',
                'status',
                'notes',
                'booking_id',
                'visit_id',
                'user_id',
              ],
              required: false, // Left outer join
              where: {
                reservation_date: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
            },
          ],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function venueStatusMonthWise(startOfMonth, endOfMonth) {
  try {
    const result = venues.findAll({
      attributes: ['id', 'venue_name'],
      where: {
        is_live: true,
      },
      include: [
        {
          model: venuereservations,
          as: 'roomreservations',
          attributes: [
            'reservation_date',
            'status',
            'notes',
            'booking_id',
            'visit_id',
            'user_id',
          ],
          required: false, // Left outer join
          where: {
            reservation_date: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

module.exports = {
  roomStatusMonthWise,
  venueStatusMonthWise,
};
