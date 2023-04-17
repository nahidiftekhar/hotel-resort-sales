const { Sequelize, Op } = require("sequelize");
const {credentials, usertypes} = require("../../database/models");

async function selectAllDb(tableName) {
  console.log('tableName: ' + tableName);
  try {
    const result = await tableName.findAll();
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function selectSingleFilterDb(tableName, fieldName, fieldValue) {
  try {
    const result = await tableName.findAll({
      where: { [fieldName]: fieldValue },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function selectUniqueFilterDb(tableName, fieldName, fieldValue) {
  try {
    const result = await tableName.findOne({
      where: { [fieldName]: fieldValue },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

module.exports = {
  selectAllDb,
  selectSingleFilterDb,
  selectUniqueFilterDb,
};
