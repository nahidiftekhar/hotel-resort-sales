//List of possible actions
const Sequelize = require("sequelize");
const db = require("../index");

const ActionLists = db.define("actionlists", {
  action_type_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  action_icon: {
    type: Sequelize.STRING,
  },
});

ActionLists.sync({alter: true}).then(() => {
  console.log("ActionLists table synced");
});

module.exports = ActionLists;
