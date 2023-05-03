const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ServiceCategories = sequelize.define(`servicecategories`, {
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
  ServiceCategories.associate = function (models) {
    ServiceCategories.hasMany(models.serviceitems, {
      foreignKey: 'category_id',
    });
  };

  return ServiceCategories;
};

// conference/amenities/etc...    Spa services
// Fitness center or gym
// Business center
// Meeting or event rooms
// Concierge services
// Room service
// Housekeeping
// Laundry services
// Valet parking
// Airport shuttle service
// Tours or excursions
// Gift shop or convenience store
// And more
