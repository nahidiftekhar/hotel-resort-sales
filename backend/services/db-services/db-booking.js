const { Sequelize, Op } = require('sequelize');
const {
  bookings,
  discounts,
  discountslabs,
  credentials,
  usertypes,
} = require('../../database/models');

async function searchGuests(searchString) {
  try {
    const result = guests.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
          {
            phone: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
          {
            id_number: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
          {
            address: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
        ],
      },

      // where : Sequelize.where(
      //     Sequelize.fn('lower', Sequelize.col('name')),
      //     Sequelize.fn('lower', searchString)
      //   )
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function returnLoa(userId) {
  try {
    const result = await credentials.findOne({
      raw: true,
      attributes: ['usertype->discountslabs.discount_percentage'],
      where: { id: userId },
      include: [
        {
          model: usertypes,
          attributes: [],
          include: {
            model: discountslabs,
            attributes: [],
          },
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

module.exports = {
  searchGuests,
  returnLoa,
};
