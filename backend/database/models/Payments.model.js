const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define(`payments`, {
    payment_method: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'BDT',
    },
    transaction_id: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payment_gateway: {
      type: Sequelize.STRING,
    },
    reconciliation_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    refund_date: {
      type: Sequelize.DATE,
    },
    refund_amount: {
      type: Sequelize.DECIMAL(15, 4),
    },
    payment_notes: {
      type: Sequelize.TEXT,
    },
  });

  // Class Method
  Payments.associate = function (models) {
    Payments.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Payments.belongsTo(
      models.invoices,
      { foreignKey: 'invoice_id' },
      { optional: true }
    );
    Payments.belongsTo(
      models.bookings,
      { foreignKey: 'booking_id' },
      { optional: true }
    );
  };

  return Payments;
};
