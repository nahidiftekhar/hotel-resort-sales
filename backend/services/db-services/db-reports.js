const { Sequelize, Op } = require('sequelize');
const {
  bookings,
  discounts,
  discountslabs,
  credentials,
  usertypes,
  visits,
  visitorexpenses,
  productpurchases,
  productrequisitions,
  products,
  storestocks,
} = require('../../database/models');

async function revenueTotal(startDate, endDate) {
  try {
    const result = await visitorexpenses.findOne({
      attributes: [
        [Sequelize.literal('SUM(item_count * unit_price)'), 'totalRevenue'],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function revenueDaily(startDate, endDate) {
  try {
    const result = await visitorexpenses.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'day'],
        [Sequelize.literal('SUM(item_count * unit_price)'), 'totalRevenue'],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      order: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
    });

    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function expenseDaily(startDate, endDate) {
  try {
    const result = await productpurchases.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('updatedAt')), 'day'],
        [Sequelize.literal('SUM(actual_cost)'), 'totalExpense'],
      ],
      where: {
        updatedAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: [Sequelize.fn('DATE', Sequelize.col('updatedAt'))],
      order: [Sequelize.fn('DATE', Sequelize.col('updatedAt'))],
    });

    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function salesPerformanceDb(startDate, endDate) {
  try {
    const result = await bookings.findAll({
      raw: true,
      attributes: [
        'user_id',
        'credential.username',
        [Sequelize.fn('COUNT', Sequelize.literal('*')), 'total_count'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'booking_amount'],
        [
          Sequelize.fn('SUM', Sequelize.col('discounted_amount')),
          'total_discounted_amount',
        ],
        [
          Sequelize.literal(`SUM(amount - discounted_amount)`),
          'total_discount',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.literal(
              "CASE WHEN booking_status = 'cancelled' THEN 1 ELSE NULL END"
            )
          ),
          'cancelled_booking',
        ],
      ],
      include: [
        {
          model: credentials,
          attributes: [],
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },

      group: ['user_id', 'credential.username'],
    });

    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function purchaseRequisitionByUserDb(userId, startDate, endDate) {
  try {
    const result = await productpurchases.findAll({
      where: {
        requester_id: userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      include: [
        {
          model: credentials,
          as: 'purchase_requester',
          attributes: ['username'],
        },
        {
          model: products,
          attributes: ['name'],
        },
      ],
    });

    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function itemsRequisitionByUserDb(userId, startDate, endDate) {
  try {
    const result = await productrequisitions.findAll({
      where: {
        requester_id: userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      include: [
        {
          model: credentials,
          as: 'requisition_requester',
          attributes: ['username'],
        },
        {
          model: products,
          attributes: ['name', 'unit'],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function bookingByUserDb(userId, startDate, endDate) {
  try {
    const result = await bookings.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      attributes: [
        'id',
        'user_id',
        'booking_ref',
        'checkin_date',
        'checkout_date',
        'booking_status',
        'amount',
        'discounted_amount',
        'createdAt',
      ],
      include: [
        {
          model: credentials,
          attributes: ['username'],
        },
        {
          model: discounts,
          attributes: ['percentage_value', 'approval_status'],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function stockReportByDateDb(startDate, endDate) {
  // const currentStock = await storestocks.findAll({
  //   attributes: ['product_id', 'quantity'],
  //   include: [
  //     {
  //       model: products,
  //       attributes: ['name', 'unit'],
  //     },
  //   ],
  // });

  const currentStock = await products.findAll({
    attributes: ['id', 'name', 'unit'],
    include: [
      {
        model: storestocks,
        attributes: ['quantity'],
      },
    ],
  });

  const purchaseAfterEndDate = await productpurchases.findAll({
    attributes: [
      'product_id',
      [Sequelize.literal('SUM(quantity)'), 'total_quantity'],
    ],
    include: [
      {
        model: products,
        attributes: [],
      },
    ],
    where: {
      updatedAt: {
        [Op.gte]: endDate,
      },
      status: 'purchased',
    },
    group: ['product_id'],
  });

  const purchaseBetweenDates = await productpurchases.findAll({
    attributes: [
      'product_id',
      [Sequelize.literal('SUM(quantity)'), 'total_quantity'],
    ],
    where: {
      updatedAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
      status: 'purchased',
    },
    group: ['product_id'],
  });

  const requisitionBetweenDates = await productrequisitions.findAll({
    attributes: [
      'product_id',
      [Sequelize.literal('SUM(quantity)'), 'total_quantity'],
    ],
    where: {
      updatedAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
      status: 'fullfilled',
    },
    group: ['product_id'],
  });

  return {
    currentStock,
    purchaseAfterEndDate,
    purchaseBetweenDates,
    requisitionBetweenDates,
  };
}

module.exports = {
  revenueTotal,
  revenueDaily,
  expenseDaily,
  salesPerformanceDb,
  purchaseRequisitionByUserDb,
  itemsRequisitionByUserDb,
  bookingByUserDb,
  stockReportByDateDb,
};
