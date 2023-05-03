const dbStandard = require('./db-services/db-standard');
const {
  packages,
  prixfixeitems,
  alacarteitems,
  rooms,
  serviceitems,
} = require('../database/models');

async function fetchAllPackages(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(packages);
  return res.json(dbResult);
}

async function fetchAllRooms(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(rooms);
  return res.json(dbResult);
}

async function fetchAllPrixfixes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(prixfixeitems);
  return res.json(dbResult);
}

async function fetchAllAlacarte(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(alacarteitems);
  return res.json(dbResult);
}

async function fetchAllServices(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(serviceitems);
  return res.json(dbResult);
}

async function addPackage(req, res, next) {
  const { name, categoryId, description, price, imageUrl } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(packages, {
    name: name,
    description: description,
    price: price,
    category_id: categoryId,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editPackage(req, res, next) {
  const { name, categoryId, description, price, imageUrl, packageId } =
    req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    packages,
    { id: packageId },
    {
      name: name,
      description: description,
      price: price,
      category_id: categoryId,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function addPrixfixeItem(req, res, next) {
  const { name, categoryId, description, price, imageUrl } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(prixfixeitems, {
    name,
    description,
    category_id: categoryId,
    price,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editPrixfixeItem(req, res, next) {
  const { name, categoryId, description, price, imageUrl, prixfixeId } =
    req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    prixfixeitems,
    { id: prixfixeId },
    {
      name: name,
      description: description,
      category_id: categoryId,
      price: price,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function addAlacarteItem(req, res, next) {
  const { name, categoryId, description, price, imageUrl } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(alacarteitems, {
    name: name,
    description: description,
    category_id: categoryId,
    price: price,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editAlacarteItem(req, res, next) {
  const { name, categoryId, description, price, imageUrl, alacarteId } =
    req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    alacarteitems,
    { id: alacarteId },
    {
      name: name,
      description: description,
      category_id: categoryId,
      price: price,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function addRoom(req, res, next) {
  const {
    roomNumber,
    roomName,
    roomTypeId,
    roomLocation,
    description,
    imageUrl,
  } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(rooms, {
    room_name: roomName,
    room_number: roomNumber,
    room_type_id: roomTypeId,
    room_location: roomLocation,
    description,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editRoom(req, res, next) {
  const {
    roomNumber,
    roomName,
    roomTypeId,
    roomLocation,
    description,
    imageUrl,
    roomId,
  } = req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    rooms,
    { id: roomId },
    {
      room_name: roomName,
      room_number: roomNumber,
      room_type_id: roomTypeId,
      room_location: roomLocation,
      description: description,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function addService(req, res, next) {
  const { name, description, size, price, imageUrl, categoryId } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(rooms, {
    name: name,
    description: description,
    size: size,
    price: price,
    category_id: categoryId,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editService(req, res, next) {
  const { name, description, size, price, imageUrl, categoryId, serviceId } =
    req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    rooms,
    { id: serviceId },
    {
      name: name,
      description: description,
      size: size,
      price: price,
      category_id: categoryId,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

module.exports = {
  fetchAllPackages,
  fetchAllRooms,
  fetchAllPrixfixes,
  fetchAllServices,
  fetchAllAlacarte,
  addPackage,
  editPackage,
  addPrixfixeItem,
  editPrixfixeItem,
  addAlacarteItem,
  editAlacarteItem,
  addRoom,
  editRoom,
  addService,
  editService,
};
