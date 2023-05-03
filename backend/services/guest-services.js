const dbStandard = require('./db-services/db-standard');
const dbGuest = require('./db-services/db-guests');
const { guests } = require('../database/models');

async function addNewGuest(req, res, next) {
  const {
    name,
    phone,
    email,
    address,
    nationality,
    dob,
    idType,
    idNumber,
    notes,
  } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(guests, {
    name: name,
    phone: phone,
    email: email,
    address: address,
    nationality: nationality || 'Bangladeshi',
    date_of_birth: dob,
    id_type: idType,
    id_number: idNumber,
    guest_notes: notes,
  });
  return res.json(dbResult);
}

async function listAllGuests(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(guests);
  return res.json(dbResult);
}

async function searchGuests(req, res, next) {
  const searchString = req.params.searchString;
  const dbResult = await dbGuest.searchGuests(searchString);
  return res.json(dbResult);
}

module.exports = {
  addNewGuest,
  listAllGuests,
  searchGuests,
};
