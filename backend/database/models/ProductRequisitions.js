const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductRequisitions = sequelize.define(`productrequisitions`, {
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    notes: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
      // values: ['pending', 'delivered', 'cancelled'],
    },
  });

  // Class Method
  ProductRequisitions.associate = function (models) {
    ProductRequisitions.belongsTo(models.products, {
      foreignKey: 'product_id',
    });
    ProductRequisitions.belongsTo(models.credentials, {
      as: 'requisition_requester',
      foreignKey: 'requester_id',
    });
    ProductRequisitions.belongsTo(models.credentials, {
      as: 'requisition_approver',
      foreignKey: 'approver_id',
      optional: true,
    });
  };

  return ProductRequisitions;
};
