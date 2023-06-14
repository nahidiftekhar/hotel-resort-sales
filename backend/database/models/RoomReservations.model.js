const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const RoomReservations = sequelize.define(`roomreservations`, {
    reservation_date: {
      type: Sequelize.DATEONLY,
    },
    status: {
      type: Sequelize.STRING, //provisioned, disountPending, confirmed, blank
    },
    notes: {
      type: Sequelize.TEXT,
    },
  });

  // Class Method
  RoomReservations.associate = function (models) {
    RoomReservations.belongsTo(models.rooms, { foreignKey: 'room_id' });
    RoomReservations.belongsTo(models.bookings, { foreignKey: 'booking_id' });
    RoomReservations.belongsTo(models.visits, { foreignKey: 'visit_id' });
    RoomReservations.belongsTo(models.credentials, { foreignKey: 'user_id' });
  };

  return RoomReservations;
};
