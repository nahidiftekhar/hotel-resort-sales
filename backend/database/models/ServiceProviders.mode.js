const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ServiceProviders = sequelize.define(`serviceproviders`, {
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
  });

  // Class Method
  ServiceProviders.associate = function (models) {
    ServiceProviders.belongsTo(models.serviceitems, {
      foreignKey: 'service_id',
    });
  };

  return ServiceProviders;
};

// each individual items
