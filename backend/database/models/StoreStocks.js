const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StoreStocks = sequelize.define(`storestocks`, {
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  // Class Method
  StoreStocks.associate = function (models) {
    StoreStocks.belongsTo(models.products, {
      foreignKey: 'product_id',
    });
  };

  return StoreStocks;
};
