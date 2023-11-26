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
const { parseDateString } = require('../utils/helper');

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

async function listProductRequisitionsByProductIdDb(productId) {
  const res = await productrequisitions.findAll({
    where: {
      product_id: productId,
      updatedAt: {
        [Op.gte]: new Date(new Date() - 60 * 60 * 24 * 1000 * 60),
      },
      status: 'fullfilled',
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

async function itemWiseDailyFulfilled(startDatestring, endDatestring) {
  const res = await productrequisitions.findAll({
    where: {
      updatedAt: {
        [Op.gte]: parseDateString(startDatestring),
        [Op.lt]: parseDateString(endDatestring),
      },
      status: 'fullfilled',
    },
    attributes: [
      'product_id',
      [Sequelize.fn('sum', Sequelize.col('quantity')), 'total_quantity'],
    ],
    group: ['product_id', 'product.id'],
    include: [
      {
        model: products,
        attributes: ['name'],
      },
    ],
  });
  return res;
}

async function itemWiseDailyPurchased(startDatestring, endDatestring) {
  const res = await productpurchases.findAll({
    where: {
      updatedAt: {
        [Op.gte]: parseDateString(startDatestring),
        [Op.lt]: parseDateString(endDatestring),
      },
      status: 'purchased',
    },
    attributes: [
      'product_id',
      [Sequelize.fn('sum', Sequelize.col('quantity')), 'total_quantity'],
      [Sequelize.fn('sum', Sequelize.col('actual_cost')), 'total_cost'],
    ],
    group: ['product_id', 'product.id'],
    include: [
      {
        model: products,
        attributes: ['name'],
      },
    ],
  });
  return res;
}

async function listProductsDb() {
  const res = await products.findAll({
    order: [['name', 'ASC']],
  });
  return res;
}

module.exports = {
  listProductRequisitionsDb,
  listProductPurchasesDb,
  listProductRequisitionsByProductIdDb,
  itemWiseDailyFulfilled,
  itemWiseDailyPurchased,
  listProductsDb,
};
