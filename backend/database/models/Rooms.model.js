const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define(`rooms`, {
    room_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    room_name: {
      type: Sequelize.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('room_name');
        return rawValue || this.getDataValue('room_number');
      },
    },
    room_location: {
      type: Sequelize.STRING,
    },
    is_booked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_live: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  Rooms.associate = function (models) {
    Rooms.belongsTo(models.roomtypes, { foreignKey: 'room_type_id' });
  };

  return Rooms;
};
