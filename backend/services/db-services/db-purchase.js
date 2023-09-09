const { Sequelize, Op } = require('sequelize');
const {
  products,
  productcategories,
  productsubcategories,
  productrequisitions,
  productpurchases,
  credentials,
  usertypes,
} = require('../../database/models');

async function listProductRequisitionsDb(status) {
  const res = await productrequisitions.findAll({
    where: {
      status: status,
    },
    include: [
      {
        model: products,
        include: [
          {
            model: productsubcategories,
            include: [
              {
                model: productcategories,
              },
            ],
          },
        ],
      },
      {
        model: credentials,
        as: 'requisition_requester',
        attributes: ['username'],
        include: [
          {
            model: usertypes,
          },
        ],
      },
      {
        model: credentials,
        as: 'requisition_approver',
        attributes: ['username'],
        include: [
          {
            model: usertypes,
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });
  return res;
}

async function listProductPurchasesDb(status) {
  const res = await productpurchases.findAll({
    where: {
      status: status,
    },
    include: [
      {
        model: products,
        include: [
          {
            model: productsubcategories,
            include: [
              {
                model: productcategories,
              },
            ],
          },
        ],
      },
      {
        model: credentials,
        as: 'purchase_requester',
        attributes: ['username'],
        include: [
          {
            model: usertypes,
          },
        ],
      },
      {
        model: credentials,
        as: 'purchase_approver',
        attributes: ['username'],
        include: [
          {
            model: usertypes,
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });
  return res;
}

module.exports = {
  listProductRequisitionsDb,
  listProductPurchasesDb,
};
