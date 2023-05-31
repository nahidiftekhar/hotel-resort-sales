const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PrixFixeItems = sequelize.define(`prixfixeitems`, {
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
  PrixFixeItems.associate = function (models) {
    PrixFixeItems.belongsTo(models.prixfixecategories, {
      foreignKey: 'category_id',
    });
  };

  return PrixFixeItems;
};

// Bangla Menu # 01/ Chinese Menu # 03/ etc...
