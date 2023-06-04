const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const VisitorExpenses = sequelize.define(`visitorexpenses`, {
    item_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    item_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    item_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
  });

  // Class Method
  VisitorExpenses.associate = function (models) {
    VisitorExpenses.belongsTo(models.visits, { foreignKey: 'visit_id' });
    VisitorExpenses.belongsTo(models.bookings, { foreignKey: 'booking_id' });
  };

  return VisitorExpenses;
};
