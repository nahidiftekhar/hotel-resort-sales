const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const UserTypes = sequelize.define(
    `usertypes`,
    {
      user_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // Class Method
  UserTypes.associate = function (models) {
    UserTypes.hasMany(models.credentials, { foreignKey: 'user_type_id' });
    UserTypes.hasMany(models.discountslabs, { foreignKey: 'user_type_id' });
  };

  return UserTypes;
};
