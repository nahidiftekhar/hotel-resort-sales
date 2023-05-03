const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PrixFixeCategories = sequelize.define(`prixfixecategories`, {
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
  PrixFixeCategories.associate = function (models) {
    PrixFixeCategories.belongsTo(models.menus, { foreignKey: 'menu_id' });
    PrixFixeCategories.hasMany(models.prixfixeitems, {
      foreignKey: 'category_id',
    });
  };

  return PrixFixeCategories;
};

// Vegetarian Menu/Summer/Winter/Corporate/Regular/Gala Dinner/Snacks/Breakfast/Additional items
