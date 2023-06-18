const { Sequelize, Op } = require('sequelize');
const { roomtypes, rooms, roomreservations } = require('../../database/models');

async function roomStatusMonthWise(startOfMonth, endOfMonth) {
  try {
    // const result = await roomtypes.findAll({
    //   raw: true,
    //   attributes: [
    //     'room_type_name',
    //     'rooms.room_number',
    //     // 'rooms->roomreservations.reservation_date',
    //     // 'rooms->roomreservations.status',
    //     // 'rooms->roomreservations.notes',
    //     // 'rooms->roomreservations.booking_id',
    //     // 'rooms->roomreservations.visit_id',
    //     // 'rooms->roomreservations.user_id',
    //   ],
    //   include: [
    //     {
    //       model: rooms,
    //       attributes: [],
    //       //   include: {
    //       //     model: roomreservations,
    //       //     attributes: [],
    //       //     where: {
    //       //       reservation_date: {
    //       //         [Op.between]: [startOfMonth, endOfMonth],
    //       //       },
    //       //     },
    //       //   },
    //     },
    //   ],
    // });

    const result = roomtypes.findAll({
      attributes: ['room_type_name'],
      include: [
        {
          model: rooms,
          attributes: ['id', 'room_number'],
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

module.exports = {
  roomStatusMonthWise,
};
