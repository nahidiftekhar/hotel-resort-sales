const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define(`bookings`, {
    checkin_date: {
      type: Sequelize.DATEONLY,
    },
    checkout_date: {
      type: Sequelize.DATEONLY,
    },
    components: {
      type: Sequelize.JSON,
    },
    price_components: {
      type: Sequelize.JSON,
    },
    payment_method: {
      type: Sequelize.STRING,
      defaultValue: 'TBD',
    },
    amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    discounted_amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    advanced_amount: {
      type: Sequelize.DECIMAL(15, 4),
      defaultValue: 0,
    },
    advanced_notes: {
      type: Sequelize.TEXT,
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'BDT',
    },
    payment_status: {
      type: Sequelize.STRING,
      defaultValue: false,
    },
    booking_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    booking_notes: {
      type: Sequelize.TEXT,
    },
    booking_ref: {
      type: Sequelize.STRING,
      defaultValue: 'FNFGZ_0001',
    },
    readiness: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    channel: {
      type: Sequelize.STRING,
      defaultValue: 'sales',
    },
  });

  // Class Method
  Bookings.associate = function (models) {
    Bookings.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Bookings.belongsTo(models.credentials, { foreignKey: 'user_id' });
    Bookings.hasMany(models.payments, { foreignKey: 'booking_id' });
    Bookings.hasMany(models.invoices, { foreignKey: 'booking_id' });
    Bookings.hasOne(models.discounts, { foreignKey: 'booking_id' });
    Bookings.hasOne(models.visitorexpenses, { foreignKey: 'booking_id' });
    Bookings.hasMany(models.roomreservations, { foreignKey: 'booking_id' });
  };

  return Bookings;
};
