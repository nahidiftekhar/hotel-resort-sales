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
  Packages.associate = function (models) {
    Packages.belongsTo(models.packagecategories, { foreignKey: 'category_id' });
  };

  return Packages;
};

// each individual items
