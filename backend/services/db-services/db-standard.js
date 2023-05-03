const { Op, Sequelize } = require('sequelize');

async function selectAllDb(tableName) {
  try {
    const result = await tableName.findAll({
      order: [['id', 'asc']],
    });
    return result;
  } catch (error) {
    console.log(`Error executing query: ${error}`);
    return 0;
  }
}

async function findAllFilterDb(tableName, filterCondition) {
  console.log('We are finding all');
  console.log('filterCondition : ' + JSON.stringify(filterCondition));
  try {
    const result = await tableName.findAll({
      where: filterCondition,
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function findOneFilterDb(tableName, filterCondition) {
  try {
    const result = await tableName.findOne({
      where: filterCondition,
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function addSingleRecordDB(tableName, recordToAdd) {
  try {
    const dbResult = await tableName.create(recordToAdd, {
      logQueryParameters: true,
    });
    return dbResult;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function addMultipleRecorsdDB(tableName, recordToAdd) {
  try {
    const dbResult = await tableName.bulkCreate(recordToAdd);
    return dbResult;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function modifySingleRecordDb(tableName, filterCondition, recordToMod) {
  try {
    const result = await tableName.update(recordToMod, {
      where: filterCondition,
    });
    return result;
  } catch (error) {
    console.log('Error executing query. ' + error);
    return 0;
  }
}

module.exports = {
  selectAllDb,
  findOneFilterDb,
  findAllFilterDb,
  addSingleRecordDB,
  addMultipleRecorsdDB,
  modifySingleRecordDb,
};
