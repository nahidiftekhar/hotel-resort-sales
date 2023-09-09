const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductCategories = sequelize.define(
    `productcategories`,
    {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // Class Method
  ProductCategories.associate = function (models) {
    ProductCategories.hasMany(models.productsubcategories, {
      foreignKey: 'category_id',
    });
  };

  return ProductCategories;
};
