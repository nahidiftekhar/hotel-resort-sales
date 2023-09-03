const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Venues = sequelize.define(`venues`, {
    venue_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    venue_location: {
      type: Sequelize.STRING,
    },
    is_ready: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    is_live: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  Venues.associate = function (models) {
    Venues.hasMany(models.venuereservations, {
      foreignKey: 'venue_id',
      as: 'roomreservations',
    });
  };

  return Venues;
};
