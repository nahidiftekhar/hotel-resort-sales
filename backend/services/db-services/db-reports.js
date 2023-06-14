const { Sequelize, Op } = require('sequelize');
const {
  bookings,
  discounts,
  discountslabs,
  credentials,
  usertypes,
  visits,
  visitorexpenses,
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

module.exports = {
  revenueTotal,
  revenueDaily,
  salesPerformanceDb,
};
