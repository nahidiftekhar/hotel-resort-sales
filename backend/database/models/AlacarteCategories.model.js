const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AlacarteCategories = sequelize.define(`alacartecategories`, {
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
  AlacarteCategories.associate = function (models) {
    AlacarteCategories.belongsTo(models.menus, { foreignKey: 'menu_id' });
    AlacarteCategories.hasMany(models.alacarteitems, {
      foreignKey: 'category_id',
    });
  };

  return AlacarteCategories;
};

// Appetizers/Entrees/Desserts/Beverages/Breakfast/Lunch/Dinner
