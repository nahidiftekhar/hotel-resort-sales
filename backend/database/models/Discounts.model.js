const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Discounts = sequelize.define(`discounts`, {
    percentage_value: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    rack_price: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    total_discount: {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    },
    approval_status: {
      type: Sequelize.STRING,
      defaultValue: false,
    },
    discount_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    approval_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price_components: {
      type: Sequelize.JSON,
    },
  });

  // Class Method
  Discounts.associate = function (models) {
    Discounts.belongsTo(models.credentials, {
      as: 'requester',
      foreignKey: 'requester_id',
    });
    Discounts.belongsTo(models.credentials, {
      as: 'approver',
      foreignKey: 'approver_id',
      optional: true,
    });
    Discounts.belongsTo(models.bookings, { foreignKey: 'booking_id' });
  };

  return Discounts;
};
