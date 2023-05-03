const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ServiceItems = sequelize.define(`serviceitems`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    size: {
      type: Sequelize.STRING,
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
  });

  // Class Method
  ServiceItems.associate = function (models) {
    ServiceItems.belongsTo(models.servicecategories, {
      foreignKey: 'category_id',
    });
    ServiceItems.hasMany(models.serviceproviders, { foreignKey: 'service_id' });
  };

  return ServiceItems;
};

// each individual items
