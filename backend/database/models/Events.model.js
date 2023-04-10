const Sequelize = require("sequelize");
const db = require("../index");

const Events = db.define("events", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  card_id: {
    type: Sequelize.INTEGER,
  },
  action: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.DATE,
  },
  origin: {
    type: Sequelize.STRING,
  },
  headers: {
    type: Sequelize.TEXT,
  }
});

Events.sync({alter: true}).then(() => {
  console.log("Events table synced");
});

module.exports = Events;
