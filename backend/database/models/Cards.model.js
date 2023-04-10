const Sequelize = require("sequelize");
const db = require("../index");

const Cards = db.define("cards", {
  card_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    //Linked to Users
  },
  card_link: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  group_id: {
    type: Sequelize.INTEGER,
    //Linked to CardGroups
  },
  order_reference: {
    type: Sequelize.STRING,
    //To be put by admin from ecommerce
  },
  order_email: {
    type: Sequelize.STRING,
    allowNull: false,
    //To be put by admin from ecommerce
  },
  qr_code: {
    type: Sequelize.STRING,
    //Image filename for qr code
  },
  card_tag: {
    type: Sequelize.STRING,
    //a tag for identifying the card...my card, wife's card, mustafiz
  },
  action_id: {
    type: Sequelize.INTEGER,
    //Linked to ActionList table
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  is_blocked: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  is_pro: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  view_password: {
    type: Sequelize.STRING,
    default: null,
  }
});

Cards.sync({alter: true}).then(() => {
  console.log("cards table synced");
});

module.exports = Cards;
