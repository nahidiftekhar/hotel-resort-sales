const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    `products`,
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // Class Method
  Products.associate = function (models) {
    Products.belongsTo(models.productsubcategories, {
      foreignKey: 'subcategory_id',
    });
    Products.hasMany(models.productrequisitions, {
      foreignKey: 'product_id',
    });
  };

  return Products;
};
