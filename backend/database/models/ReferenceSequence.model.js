const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ReferenceSequences = sequelize.define(`referencesequences`, {
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, //0 for booking, 1 for checkin
    record_date: {
      type: Sequelize.DATEONLY,
    },
    seq: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  // Class Method
  ReferenceSequences.associate = function (models) {};

  return ReferenceSequences;
};
