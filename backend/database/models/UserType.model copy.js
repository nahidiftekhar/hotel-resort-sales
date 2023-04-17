"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  var UserTypes = sequelize.define(
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
      UserTypes.hasOne(models.credentials, {foreignKey: 'user_type_id'});
    };
  
  return UserTypes;
};
