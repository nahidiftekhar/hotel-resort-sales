const Sequelize = require("sequelize");
const db = require("../index");

const Vcards = db.define("vcards", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action_id: {
    type: Sequelize.INTEGER,
  },
  profile_image: {
    type: Sequelize.STRING,
  },
  vcard_attribute: {
    type: Sequelize.JSON,
  }
});

Vcards.sync({alter: true}).then(() => {
  console.log("vcards table synced");
});

module.exports = Vcards;
