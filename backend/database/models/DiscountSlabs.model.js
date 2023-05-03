'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const DiscountSlabs = sequelize.define(`discountslabs`, {
    discount_percentage: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });

  // Class Method
  DiscountSlabs.associate = function (models) {
    DiscountSlabs.belongsTo(models.usertypes, { foreignKey: 'user_type_id' });
  };

  return DiscountSlabs;
};
