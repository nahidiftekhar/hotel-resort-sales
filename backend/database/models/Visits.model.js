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
    group_size: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    group_details: {
      type: Sequelize.TEXT,
    },
    additional_guests: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    visit_notes: {
      type: Sequelize.TEXT,
    },
  });

  // Class Method
  Visits.associate = function (models) {
    Visits.belongsTo(models.guests, { foreignKey: 'guest_id' });
  };

  return Visits;
};
