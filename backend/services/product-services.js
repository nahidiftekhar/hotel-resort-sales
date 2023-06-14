const dbStandard = require('./db-services/db-standard');
const {
  packages,
  prixfixeitems,
  alacarteitems,
  rooms,
  roomtypes,
  serviceitems,
  packagecategories,
  prixfixecategories,
  alacartecategories,
  servicecategories,
} = require('../database/models');

async function fetchAllPackages(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb(packages, {
    is_active: true,
  });
  return res.json(dbResult);
}

async function fetchAllRooms(req, res, next) {
  // const dbResult = await dbStandard.joinAllDb(rooms, roomtypes);
  const dbResult = await dbStandard.joinFilterDb(rooms, roomtypes, {
    is_live: true,
  });
  return res.json(dbResult);
}

async function fetchAllPrixfixes(req, res, next) {
  const dbResult = await dbStandard.joinFilterDb(
    prixfixeitems,
    prixfixecategories,
    {
      is_active: true,
    }
  );
  return res.json(dbResult);
}

async function fetchAllAlacarte(req, res, next) {
  const dbResult = await dbStandard.joinFilterDb(
    alacarteitems,
    alacartecategories,
    {
      is_active: true,
    }
  );
  return res.json(dbResult);
}

async function fetchAllServices(req, res, next) {
  const dbResult = await dbStandard.joinFilterDb(
    serviceitems,
    servicecategories,
    {
      is_active: true,
    }
  );
  return res.json(dbResult);
}

async function addPackage(req, res, next) {
  const {
    name,
    categoryId,
    description,
    priceAdult,
    priceKids,
    imageUrl,
    unit,
    unitKids,
  } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(packages, {
    name: name,
    description: description,
    price_adult: priceAdult,
    price_kids: priceKids,
    category_id: categoryId,
    image_url: imageUrl,
    unit: unit,
    unit_kids: unitKids,
  });
  return res.json(dbResult);
}

async function editPackage(req, res, next) {
  const {
    name,
    productType,
    description,
    priceAdult,
    priceKids,
    imageUrl,
    packageId,
    unit,
    unitKids,
  } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    packages,
    { id: packageId },
    {
      name: name,
      description: description,
      price_adult: priceAdult,
      price_kids: priceKids,
      category_id: productType,
      image_url: imageUrl,
      unit: unit,
      unit_kids: unitKids,
    }
  );
  return res.json(dbResult);
}

async function deactivatePackage(req, res, next) {
  const { packageId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    packages,
    { id: packageId },
    {
      is_active: false,
    }
  );
  return res.json(dbResult);
}

async function activatePackage(req, res, next) {
  const { packageId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    packages,
    { id: packageId },
    {
      is_active: true,
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
  const { name, productType, description, price, imageUrl, prixfixeId } =
    req.body;
  console.log('req.body: ' + JSON.stringify(req.body));
  const dbResult = await dbStandard.modifySingleRecordDb(
    prixfixeitems,
    { id: prixfixeId },
    {
      name: name,
      description: description,
      category_id: productType,
      price: price,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function deactivatePrixfixe(req, res, next) {
  const { prixfixeId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    prixfixeitems,
    { id: prixfixeId },
    {
      is_active: false,
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

async function deactivateAlacarte(req, res, next) {
  const { alacarteId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    alacarteitems,
    { id: alacarteId },
    {
      is_active: false,
    }
  );
  return res.json(dbResult);
}

async function addRoom(req, res, next) {
  const {
    roomNumber,
    roomName,
    categoryId,
    roomLocation,
    description,
    imageUrl,
  } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(rooms, {
    room_name: roomName,
    room_number: roomNumber,
    room_type_id: categoryId,
    room_location: roomLocation,
    description,
    image_url: imageUrl,
  });
  return res.json(dbResult);
}

async function editRoom(req, res, next) {
  const {
    roomId,
    roomNumber,
    roomName,
    categoryId,
    roomLocation,
    description,
    imageUrl,
  } = req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    rooms,
    { id: roomId },
    {
      room_name: roomName,
      room_number: roomNumber,
      room_type_id: categoryId,
      room_location: roomLocation,
      description: description,
      image_url: imageUrl,
    }
  );
  return res.json(dbResult);
}

async function deactivateRoom(req, res, next) {
  const { roomId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    rooms,
    { id: roomId },
    {
      is_live: false,
    }
  );
  return res.json(dbResult);
}

async function addService(req, res, next) {
  const { name, description, size, price, imageUrl, categoryId } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(serviceitems, {
    name: name,
    description: description,
    size: size,
    price: price,
    category_id: categoryId,
    image_url: imageUrl,
    is_active: true,
  });
  return res.json(dbResult);
}

async function editService(req, res, next) {
  const { name, description, size, price, imageUrl, categoryId, serviceId } =
    req.body;
  const dbResult = await dbStandard.modifySingleRecordDb(
    serviceitems,
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

async function deactivateService(req, res, next) {
  const { serviceId } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    serviceitems,
    { id: serviceId },
    {
      is_active: false,
    }
  );
  return res.json(dbResult);
}

async function fetchPackagesTypes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(packagecategories);
  return res.json(dbResult);
}

async function fetchPrixfixeTypes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(prixfixecategories);
  return res.json(dbResult);
}

async function fetchAlacarteTypes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(alacartecategories);
  return res.json(dbResult);
}

async function fetchServiceTypes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(servicecategories);
  return res.json(dbResult);
}

async function fetchRoomTypes(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(roomtypes);
  return res.json(dbResult);
}

async function fetchRooms(req, res, next) {
  const dbResult = await dbStandard.joinAllDb(rooms, roomtypes);
  return res.json(dbResult);
}

module.exports = {
  fetchPackagesTypes,
  fetchAlacarteTypes,
  fetchPrixfixeTypes,
  fetchRoomTypes,
  fetchRooms,
  fetchServiceTypes,
  fetchAllPackages,
  fetchAllRooms,
  fetchAllPrixfixes,
  fetchAllServices,
  fetchAllAlacarte,
  addPackage,
  editPackage,
  addPrixfixeItem,
  editPrixfixeItem,
  deactivatePrixfixe,
  addAlacarteItem,
  editAlacarteItem,
  deactivateAlacarte,
  addRoom,
  editRoom,
  deactivateRoom,
  addService,
  editService,
  deactivateService,
  deactivatePackage,
  activatePackage,
};
