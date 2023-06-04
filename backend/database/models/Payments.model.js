const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define(`payments`, {
    amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'BDT',
    },
    payment_method: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_receiver: {
      type: Sequelize.STRING,
    },
    payment_notes: {
      type: Sequelize.TEXT,
    },
    reconciliation_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    refund_date: {
      type: Sequelize.DATE,
    },
  });

  // Class Method
  Payments.associate = function (models) {
    Payments.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Payments.belongsTo(models.visits, { foreignKey: 'visit_id' });
    Payments.belongsTo(models.bookings, { foreignKey: 'booking_id' });
  };

  return Payments;
};
