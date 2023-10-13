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
    const dbResult = await tableName.create(recordToAdd);
    return { success: true, dbResult };
  } catch (error) {
    console.log('Error executing query: ' + error);
    return { success: false };
  }
}

async function addMultipleRecorsdDB(tableName, recordToAdd) {
  try {
    const dbResult = await tableName.bulkCreate(recordToAdd);
    return { success: true, dbResult };
  } catch (error) {
    console.log('Error executing query: ' + error);
    return { success: false, error };
  }
}

async function modifySingleRecordDb(tableName, filterCondition, recordToMod) {
  try {
    const result = await tableName.update(recordToMod, {
      where: filterCondition,
      returning: true,
      // plain: true,
    });
    return { success: true, result };
  } catch (error) {
    console.log('Error executing query. ' + error);
    return { success: false };
  }
}

async function joinAllDb(tableName1, tableName2) {
  try {
    const result = await tableName1.findAll({
      // raw: true,
      include: [
        {
          model: tableName2,
          attributes: {},
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function joinFilterDb(tableName1, tableName2, filterCondition) {
  try {
    const result = await tableName1.findAll({
      // raw: true,
      where: filterCondition,
      include: [
        {
          model: tableName2,
          attributes: {},
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function joinFilterSingleRecordDb(
  tableName1,
  tableName2,
  filterCondition
) {
  try {
    const result = await tableName1.findOne({
      // raw: true,
      where: filterCondition,
      include: [
        {
          model: tableName2,
          attributes: {},
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function joinTwoTablesFilterDb(
  tableName1,
  tableName2,
  tableName3,
  filterCondition
) {
  try {
    const result = await tableName1.findAll({
      // raw: true,
      where: filterCondition,
      include: [
        {
          model: tableName2,
          attributes: {},
        },
        {
          model: tableName3,
          attributes: {},
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function joinThreeTablesFilterDb(
  tableName1,
  tableName2,
  tableName3,
  tableName4,
  filterCondition
) {
  try {
    const result = await tableName1.findAll({
      // raw: true,
      where: filterCondition,
      include: [
        {
          model: tableName2,
          attributes: {},
        },
        {
          model: tableName3,
          attributes: {},
        },
        {
          model: tableName4,
          attributes: {},
        },
      ],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function sumWithFilterDb(tableName, fieldName, filterCondition) {
  try {
    const result = await tableName.sum(fieldName, {
      where: filterCondition,
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function countWithFilterDb(tableName, filterCondition) {
  try {
    const result = await tableName.count({
      where: filterCondition,
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function countGroupByDb(tableName, groupField, filterCondition) {
  try {
    const result = await tableName.findAll({
      attributes: [
        groupField,
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'cnt'],
      ],
      where: filterCondition,
      group: [groupField],
      order: [groupField],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
    return 0;
  }
}

async function addOrUpdateSingleDb(tableName, filterCondition, recordToMod) {
  const existingRecord = await tableName.findOne({
    where: filterCondition,
  });

  let finalResult = { success: false };
  if (existingRecord) {
    const dbResult = await tableName.update(recordToMod, {
      where: filterCondition,
      returning: true,
    });
    finalResult = { success: true, dbResult };
  } else {
    const dbResult = await tableName.create({
      ...filterCondition,
      ...recordToMod,
    });
    finalResult = { success: true, dbResult };
  }

  return finalResult;
}

async function findAllFilterOrderbyUpdatedAtDb(tableName, filterCondition) {
  try {
    const result = await tableName.findAll({
      where: filterCondition,
      order: [['updatedAt', 'desc']],
    });
    return result;
  } catch (error) {
    console.log('Error executing query: ' + error);
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
  joinAllDb,
  joinFilterDb,
  joinFilterSingleRecordDb,
  joinTwoTablesFilterDb,
  joinThreeTablesFilterDb,
  sumWithFilterDb,
  countWithFilterDb,
  countGroupByDb,
  addOrUpdateSingleDb,
  findAllFilterOrderbyUpdatedAtDb,
};
