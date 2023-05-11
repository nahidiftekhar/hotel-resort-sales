const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define(`bookings`, {
    checkin_date: {
      type: Sequelize.DATEONLY,
    },
    checkout_date: {
      type: Sequelize.DATEONLY,
    },
    payment_method: {
      type: Sequelize.STRING,
      defaultValue: 'TBD',
    },
    adult_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    kids_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    amount: {
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
    discounted_amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'BDT',
    },
    components: {
      type: Sequelize.JSON,
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
  });

  // Class Method
  Bookings.associate = function (models) {
    Bookings.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Bookings.belongsTo(models.credentials, { foreignKey: 'user_id' });
    Bookings.hasMany(
      models.payments,
      { foreignKey: 'booking_id' },
      { optional: true }
    );
    Bookings.hasMany(
      models.invoices,
      { foreignKey: 'booking_id' },
      { optional: true }
    );
    Bookings.hasOne(models.discounts, { foreignKey: 'booking_id' });
  };

  return Bookings;
};
