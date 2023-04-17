"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  var Credentials = sequelize.define(
    `credentials`,
    {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      is_deactive: {
        type: Sequelize.BOOLEAN,
        default: true,
      },
      pass_change_required: {
        type: Sequelize.BOOLEAN,
        default: true,
      },
    },
  );

  // Class Method
  Credentials.associate = function (models) {
    Credentials.belongsTo(models.usertypes, {foreignKey: 'user_type_id'});
  };

  return Credentials;
};
