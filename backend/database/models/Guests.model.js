const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Guests = sequelize.define(`guests`, {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.TEXT,
    },
    nationality: {
      type: Sequelize.STRING,
      // defaultValue: 'Bangladeshi',
      allowNull: false,
      unique: 'compositeIndex',
    },
    date_of_birth: {
      type: Sequelize.DATEONLY,
    },
    id_type: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    id_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    guest_notes: {
      type: Sequelize.TEXT,
    },
    id_image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    photo_image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  // Class Method
  Guests.associate = function (models) {
    Guests.hasMany(models.payments, { foreignKey: 'guest_id' });
    Guests.hasMany(models.invoices, { foreignKey: 'guest_id' });
    Guests.hasMany(models.bookings, { foreignKey: 'guest_id' });
  };

  return Guests;
};
