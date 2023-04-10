//Activation code storage for both card activation and user creation
const Sequelize = require("sequelize");
const db = require("../index");

const ActivationCodes = db.define("activationcodes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  card_id: {
    type: Sequelize.INTEGER,
    //Linked to Cards. Will be available in case of Card activation (will be sent to 'order email' in Cards)
  },
  code: {
    type: Sequelize.STRING
  },
  is_confirmed: {
    type: Sequelize.BOOLEAN
  }
});

ActivationCodes.sync({alter: true}).then(() => {
  console.log("activationcodes table synced");
});

module.exports = ActivationCodes;
