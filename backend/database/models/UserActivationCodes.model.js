//Activation code storage for both card activation and user creation
const Sequelize = require("sequelize");
const db = require("../index");

const UserActivationCodes = db.define("useractivationcodes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    //Linked to Users. Will be available in case of User activation
  },
  is_confirmed: {
    type: Sequelize.BOOLEAN
  },
  validity: {
    type: Sequelize.DATE,
  },
  token: {
    type: Sequelize.STRING,
  }
});

UserActivationCodes.sync({alter: true}).then(() => {
  console.log("UserActivationCodes table synced");
});

module.exports = UserActivationCodes;
