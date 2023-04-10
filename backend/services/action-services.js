const db = require("../utils/db");
const path = require("path");
const { or } = require("sequelize");

async function testDb(req, res, next) {
  const param = req.params.parameter;
  const dbResult = await db.testQuery(param);
  return res.json(dbResult);
}

async function addAction(req, res, next) {
  const { actionType, cardId, actionAttribute, actionName } = req.body;
  console.log('actionAttribute: ' + actionAttribute);
  let attribute = actionAttribute;
  // if(actionType === 8) attribute = 'linktrees';
  switch(actionType) {
    case 8:
      attribute = 'linktrees';
      break;
    case 2:
      attribute = 'vCard';
      break;
    case 3:
      attribute = 'Profile';
      break;
    }
  const dbResult = await db.addAction(actionType, cardId, attribute, actionName);
    switch(actionType) {
      case 8:
        await db.addLinkTree(dbResult.action_id, actionAttribute);
        break;
      case 2:
        await db.addVcard(dbResult.action_id, actionAttribute)
        break;
      case 3:
        await db.addProfile(dbResult.action_id, actionAttribute);
        break;
      }
    return res.json(dbResult);
}

async function editAction(req, res, next) {
  const { actionId, cardId, actionAttribute, actionType, actionName } = req.body;
  console.log('actionAttribute: ' + JSON.stringify(actionAttribute));
  let attribute = actionAttribute;
  switch(actionType) {
    case 8:
      attribute = 'linktrees';
      break;
    case 2:
      attribute = 'vCard';
      break;
    case 3:
      attribute = 'Profile';
      break;
    }
  let dbResult;
  dbResult = await db.editAction(actionId, cardId, attribute, actionName);
  switch(actionType) {
    case 8:
      await db.editLinkTree(actionId, actionAttribute);
      break;
    case 2:
      await db.editVcard(actionId, actionAttribute);
      break;
    case 3:
      await db.editProfile(actionId, actionAttribute);
      break;
    }
  return res.json(dbResult);
}

async function deleteAction(req, res, next) {
  const { actionId } = req.body;
  const dbResult = await db.deleteAction(actionId);
  return res.json(dbResult);
}

async function getSingleAcion(req, res, next) {
  const {cardId, actionTypeId} = req.body;
  const dbResult = actionTypeId===7 ? await db.getLinkTree(cardId, actionTypeId) : await db.getSingleAcion(cardId, actionTypeId);
  return res.json(dbResult);
}

async function getSingleAcionbyId(req, res, next) {
  const {actionId} = req.body;
  const dbResult = await db.getSingleAcionbyId(actionId);
  // return res.json(dbResult?.action_type_id===8 ? await db.getLinkTreeById(actionId) : dbResult);
  // switch(dbResult?.action_type_id) {
  switch(dbResult.action_type_id) {
    case 8:
      return res.json(await db.getLinkTreeById(actionId));
      break;
    case 2:
      return res.json(await db.getVcardById(actionId));
      break;
    case 3:
      return res.json(await db.getProfileById(actionId));
      break;
    default:
      return res.json(dbResult)
  }
  // return res.json(dbResult);
}

async function defaultAction(req, res, next) {
  const {actionId, cardId} = req.body;
  const dbResult = await db.defaultAction(cardId, actionId);
  return res.json(dbResult);
}

async function getDefaultActionType(req, res, next) {
  const {actionId} = req.body;
  const dbResult = await db.getDefaultActionType(actionId);
  return res.json(dbResult);
}

async function getDefaultAction(req, res, next) {
  const {cardId} = req.body;
  const dbResult = await db.getDefaultActionDb(cardId)
  return res.json(dbResult);
}

async function getAllActionTypes(req, res, next) {
  const dbResult = await db.getAllActionTypes();
  return res.json(dbResult);
}

async function getActionTypeById(req, res, next) {
  const {actionId} = req.body;
  const dbResult = await db.getDefaultActionDetail(actionId);
  return res.json(dbResult);
}

module.exports = {
  testDb,
  addAction,
  editAction,
  deleteAction,
  getSingleAcion,
  getSingleAcionbyId,
  defaultAction,
  getDefaultActionType,
  getDefaultAction,
  getAllActionTypes,
  getActionTypeById
};
