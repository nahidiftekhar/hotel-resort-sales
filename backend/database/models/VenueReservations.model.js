const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const VenueReservations = sequelize.define(`venuereservations`, {
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
  VenueReservations.associate = function (models) {
    VenueReservations.belongsTo(models.venues, { foreignKey: 'venue_id' });
    VenueReservations.belongsTo(models.bookings, { foreignKey: 'booking_id' });
    VenueReservations.belongsTo(models.visits, { foreignKey: 'visit_id' });
    VenueReservations.belongsTo(models.credentials, { foreignKey: 'user_id' });
  };

  return VenueReservations;
};
