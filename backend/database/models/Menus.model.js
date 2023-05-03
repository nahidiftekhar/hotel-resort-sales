const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Menus = sequelize.define(`menus`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  // Class Method
  Menus.associate = function (models) {
    Menus.hasMany(models.alacartecategories, { foreignKey: 'menu_id' });
  };

  return Menus;
};

// main restaurant menu, breakfast/lunch/dinner menu
