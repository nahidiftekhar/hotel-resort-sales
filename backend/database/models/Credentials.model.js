const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Credentials = sequelize.define(`credentials`, {
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
      defaultValue: true,
    },
    pass_change_required: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  // Class Method
  Credentials.associate = function (models) {
    Credentials.belongsTo(models.usertypes, { foreignKey: 'user_type_id' });
    Credentials.hasMany(models.payments, { foreignKey: 'user_id' });
    Credentials.hasMany(models.visitorexpenses, { foreignKey: 'user_id' });
    Credentials.hasMany(models.visits, { foreignKey: 'user_id' });
    Credentials.hasMany(models.bookings, { foreignKey: 'user_id' });
    Credentials.hasMany(models.discounts, {
      as: 'requester',
      foreignKey: 'requester_id',
    });
    Credentials.hasMany(models.discounts, {
      as: 'approver',
      foreignKey: 'approver_id',
    });
    Credentials.hasMany(models.roomreservations, { foreignKey: 'user_id' });
  };

  return Credentials;
};
