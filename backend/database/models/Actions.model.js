//actions tagged with cards
const Sequelize = require("sequelize");
const db = require("../index");

const Actions = db.define("actions", {
  action_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    //tagged with action_list
  },
  card_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    //tagged with cards
  },
  action_attribute: {
    type: Sequelize.STRING,
    //profile_id for vcadr/profile. details for others
  },
  action_tag: {
    type: Sequelize.STRING,
  }
});

Actions.sync({alter: true}).then(() => {
  console.log("actions table synced");
});

module.exports = Actions;
