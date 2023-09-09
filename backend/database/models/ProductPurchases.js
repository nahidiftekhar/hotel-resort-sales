const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductPurchases = sequelize.define(`productpurchases`, {
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    actual_cost: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    },
    notes: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pendingApproval',
      // values: ['pendingApproval','approved', 'purchased', 'cancelled'],
    },
  });

  // Class Method
  ProductPurchases.associate = function (models) {
    ProductPurchases.belongsTo(models.products, {
      foreignKey: 'product_id',
    });
    ProductPurchases.belongsTo(models.credentials, {
      as: 'purchase_requester',
      foreignKey: 'requester_id',
    });
    ProductPurchases.belongsTo(models.credentials, {
      as: 'purchase_approver',
      foreignKey: 'approver_id',
      optional: true,
    });
  };

  return ProductPurchases;
};
