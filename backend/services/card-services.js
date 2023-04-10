const db = require("../utils/db");
const crypto = require("crypto");
const { generateRandomString, generateCardLink } = require("../utils/helper");
const sendMail = require("../utils/send-email");

async function testDb(req, res, next) {
  const param = req.params.cardId;
  const dbResult = await db.testQuery(param);
  return res.json(dbResult);
}

async function getCardDetail(req, res, next) {
  const param = req.params.cardId;
  const dbResult = await db.getCardDetail(param);
  return res.json(dbResult);
}

async function createCardLink(req, res, next) {
  const cardLink = await generateCardLink(12);
  return res.json(cardLink);
}

async function addCard(req, res, next) {
  const { cardLink, groupId, orderEmail, qrCode, orderReference } = req.body;
  // const cardLink = await generateCardLink(12);
  const activationCode = await generateRandomString(10);
  const dbResult = await db.addCard(
    cardLink,
    groupId,
    orderEmail,
    qrCode,
    orderReference,
    activationCode
  );

  //Send email
  const messageBody =
  "<img style='width:250px;' src='cid:logo' /> <br />Hello,<br /><br />Your Smart Taps card is now ready and on the way to you. <br />To start using the card, you'll need the following activation code. Once you receive the card, you have to enable it with this code.<br />" + 
  "Card Link: <b>" + cardLink + "</b><br />" +
  "Activation Code: <b>" + activationCode + "</b>";

  const mailSubject = "Welcome to Smarttaps - Card Activation Code";
  await sendMail.sendSingleEmail(orderEmail, messageBody, mailSubject);

  return res.json({ dbResult, activationCode });
}

async function listCards(req, res, next) {
  const { userId } = req.body;
  const dbResult = await db.listCards(userId);
  return res.json(dbResult);
}

async function blockCard(req, res, next) {
  const { cardId } = req.body;
  const dbResult = await db.blockCard(cardId);
  return res.json(dbResult);
}

async function unblockCard(req, res, next) {
  const { cardId } = req.body;
  const dbResult = await db.unblockCard(cardId);
  return res.json(dbResult);
}

async function proCard(req, res, next) {
  const { cardId } = req.body;
  const dbResult = await db.proCardDb(cardId);
  return res.json(dbResult);
}

async function unproCard(req, res, next) {
  const { cardId } = req.body;
  const dbResult = await db.unproCardDb(cardId);
  return res.json(dbResult);
}


async function activateCard(req, res, next) {
  const { cardLink, activationCode, userId } = req.body;
  //Correction for protocol
  const cardLinkCorrected = cardLink.replace(/(^\w+:|^)\/\//,"").replace(req.headers.host, "").replace(/\//g, "");
  //Correction for parent link
  // req.headers.host
  console.log('cardLink: ' + cardLink);
  console.log('cardLinkCorrected: ' + cardLinkCorrected);
  const dbResult = await db.activateCard(cardLinkCorrected, activationCode, userId);
  return res.json(dbResult);
}

async function editSingleCard(req, res, next) {
  const { cardId, cardTag, cardLink, isActive } = req.body;
  const dbResult = await db.editSingleCard(cardId, cardTag, cardLink, isActive);
  return res.json(dbResult);
}

async function getStatByCardId(req, res, next) {
  const { cardId } = req.body;
  const dbResult = await db.getStatByCardIdDb(cardId);
  return res.json(dbResult);
}

async function listAllCards(req, res, next) {
  const dbResult = await db.listAllCardsDb();
  return res.json(dbResult);
}

async function getCardInfoByCardLink(req, res, next) {
  const dbResult = await db.getCardInfoByCardLinkDB(req.params.cardLink);
  return res.json(dbResult);
}

async function dailyStatByCardId(req, res, next) {
  const {cardId, startDate, endDate} = req.body;
  const dbResult = await db.dailyStatByCardIdDb(cardId, startDate, endDate);
  return res.json(dbResult);
}

async function actionStatByCardId(req, res, next) {
  const {cardId, startDate, endDate} = req.body;
  const dbResult = await db.actionStatByCardIdDb(cardId, startDate, endDate);
  return res.json(dbResult);
}


async function resendActivationCode(req, res, next) {
  const cardLink = req.params.cardLink;
  const dbResult = await db.getCardInfoByCardLinkDB(cardLink);
  const activationCode = dbResult.code;
  const orderEmail = dbResult.order_email;
  //Send email
  const messageBody =
  "<img style='width:250px;' src='cid:logo' /> <br />Hello,<br /><br />System has received request to resend your SMART TAPS card activation code. <br />To start using the card, you'll need the following activation code. Once you receive the card, you have to enable it with this code.<br />" + 
  "Card Link: <b>" + cardLink + "</b><br />" +
  "Activation Code: <b>" + activationCode + "</b>";

  const mailSubject = "Welcome to Smarttaps - Card Activation Code (resend)";
  await sendMail.sendSingleEmail(orderEmail, messageBody, mailSubject);
  res.json(orderEmail);
}

module.exports = {
  testDb,
  getCardDetail,
  createCardLink,
  addCard,
  listCards,
  blockCard,
  unblockCard,
  proCard,
  unproCard,
  activateCard,
  editSingleCard,
  getStatByCardId,
  dailyStatByCardId,
  actionStatByCardId,
  listAllCards,
  getCardInfoByCardLink,
  resendActivationCode
};
