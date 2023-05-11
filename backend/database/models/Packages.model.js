const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Packages = sequelize.define(`packages`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    unit: {
      type: Sequelize.STRING,
      defaultValue: 'Person, Single day',
    },
    unit_kids: {
      type: Sequelize.STRING,
      defaultValue: 'Kid, Single day',
    },
    price_adult: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    price_kids: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  // Class Method
  Packages.associate = function (models) {
    Packages.belongsTo(models.packagecategories, { foreignKey: 'category_id' });
  };

  return Packages;
};

// each individual items
