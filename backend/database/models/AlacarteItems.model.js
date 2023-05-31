const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AlacarteItems = sequelize.define(`alacarteitems`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  // Class Method
  AlacarteItems.associate = function (models) {
    AlacarteItems.belongsTo(models.alacartecategories, {
      foreignKey: 'category_id',
    });
  };

  return AlacarteItems;
};

// each individual items
