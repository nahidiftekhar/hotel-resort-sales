const dbStandardServices = require('./db-services/db-standard');
const {
  credentials,
  usertypes,
  alacartecategories,
  alacarteitems,
  bookings,
  discountslabs,
  menus,
  packagecategories,
  packages,
  prixfixecategories,
  prixfixeitems,
  rooms,
  roomtypes,
  servicecategories,
  serviceitems,
  serviceproviders,
  guests,
} = require('../database/models');

async function testDb(req, res, next) {
  const dbResult = await dbStandardServices.selectAllDb(bookings);
  return res.json(dbResult);
}

async function getAllUsers(req, res, next) {
  const dbResult = await dbStandardServices.selectAllDb(usertypes);
  return res.json(dbResult);
}

async function addServiceCategories(req, res, next) {
  const dataToAdd = { name: 'In-Room Amenities' };
  const dbResult = await dbStandardServices.findOneFilterDb(
    servicecategories,
    dataToAdd
  );
  return res.json(dbResult);
}

module.exports = {
  testDb,
  getAllUsers,
  addServiceCategories,
};
