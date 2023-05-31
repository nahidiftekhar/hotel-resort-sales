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
    idFront,
    idBack,
    profileImage,
  } = req.body;

  // console.log('req.body: ' + JSON.stringify(req.body));
  // return res.json({ success: false });
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
    id_image_front: idFront,
    id_image_back: idBack,
    photo_image_url: profileImage,
  });
  return res.json(dbResult);
}

async function editGuest(req, res, next) {
  const {
    id,
    name,
    phone,
    email,
    address,
    nationality,
    dob,
    idType,
    idNumber,
    notes,
    idFront,
    idBack,
    profileImage,
  } = req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    guests,
    { id: id },
    {
      name: name,
      phone: phone,
      email: email,
      address: address,
      nationality: nationality || 'Bangladeshi',
      date_of_birth: dob,
      id_type: idType,
      id_number: idNumber,
      guest_notes: notes,
      id_image_front: idFront,
      id_image_back: idBack,
      photo_image_url: profileImage,
    }
  );
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

async function fetchSingleGuestById(req, res, next) {
  const guestId = req.params.guestId;
  const guestData = await dbStandard.findOneFilterDb(guests, {
    id: guestId,
  });
  return res.json(guestData);
}

module.exports = {
  addNewGuest,
  editGuest,
  listAllGuests,
  searchGuests,
  fetchSingleGuestById,
};
