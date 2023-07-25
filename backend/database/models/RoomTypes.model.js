const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const RoomTypes = sequelize.define(`roomtypes`, {
    room_type_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    max_adult: {
      type: Sequelize.INTEGER, 
      allowNull: false,
    },
    max_child: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    is_live: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  // Class Method
  RoomTypes.associate = function (models) {
    RoomTypes.hasMany(models.rooms, { foreignKey: 'room_type_id' });
  };

  return RoomTypes;
};
