const Sequelize = require("sequelize");
const db = require("../index");

const CardGroups = db.define("cardgroups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  group_name: {
    type: Sequelize.STRING,
  },
  group_link: {
    type: Sequelize.STRING, //https://link.smarttaps.co/card/, https://link.smarttaps.co/companyName/
    allowNull: false,
  },
});

CardGroups.sync({alter: true}).then(() => {
  console.log("cardgroups table synced");
});

module.exports = CardGroups;
