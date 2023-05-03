'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PackageCategories = sequelize.define(`packagecategories`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  // Class Method
  PackageCategories.associate = function (models) {
    PackageCategories.belongsTo(models.menus, { foreignKey: 'menu_id' });
    PackageCategories.hasMany(models.packages, { foreignKey: 'category_id' });
  };

  return PackageCategories;
};

// daylong/nightstay/corporate/special/couple
