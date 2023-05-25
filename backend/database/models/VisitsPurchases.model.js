const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const VisitPurchases = sequelize.define(`visitpurchases`, {
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
  VisitPurchases.associate = function (models) {
    VisitPurchases.belongsTo(models.visits, { foreignKey: 'visit_id' });
  };

  return VisitPurchases;
};
