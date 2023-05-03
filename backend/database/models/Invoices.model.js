const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Invoices = sequelize.define(`invoices`, {
    amount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'BDT',
    },
    issue_date: {
      type: Sequelize.DATE,
    },
    due_date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    invoice_notes: {
      type: Sequelize.TEXT,
    },
  });

  // Class Method
  Invoices.associate = function (models) {
    Invoices.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Invoices.belongsTo(
      models.bookings,
      { foreignKey: 'booking_id' },
      { optional: true }
    );
    Invoices.hasMany(
      models.payments,
      { foreignKey: 'invoice_id' },
      { optional: true }
    );
  };

  return Invoices;
};
