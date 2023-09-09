const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductSubCategories = sequelize.define(
    `productsubcategories`,
    {
      subcategory: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // Class Method
  ProductSubCategories.associate = function (models) {
    ProductSubCategories.belongsTo(models.productcategories, {
      foreignKey: 'category_id',
    });
    ProductSubCategories.hasMany(models.products, {
      foreignKey: 'subcategory_id',
    });
  };

  return ProductSubCategories;
};
