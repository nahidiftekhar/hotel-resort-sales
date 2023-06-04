const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Visits = sequelize.define(`visits`, {
    checkin_date: {
      type: Sequelize.DATEONLY,
    },
    checkout_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    room_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    additional_guests: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    visit_notes: {
      type: Sequelize.TEXT,
    },
    booking_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    advanced_amount: {
      type: Sequelize.DECIMAL(15, 4),
      defaultValue: 0,
    },
    is_settled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    visit_ref: {
      type: Sequelize.STRING,
      defaultValue: 'FNFGZ_0001',
    },
  });

  // Class Method
  Visits.associate = function (models) {
    Visits.belongsTo(models.guests, { foreignKey: 'guest_id' });
    Visits.hasMany(models.payments, { foreignKey: 'visit_id' });
  };

  return Visits;
};
