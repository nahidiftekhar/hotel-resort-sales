const Sequelize = require("sequelize");
const db = require("../index");

const LinkTrees = db.define("linktrees", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action_id: {
    type: Sequelize.INTEGER,
  },
  action_attribute: {
    type: Sequelize.JSON,
  },
  display_name: {
    type: Sequelize.STRING
  },
  about_me: {
    type: Sequelize.TEXT
  },
  image_file: {
    type: Sequelize.STRING
  },
  theme_element: {
    type: Sequelize.JSON,
  }
});

LinkTrees.sync({alter: true}).then(() => {
  console.log("linktrees table synced");
});

module.exports = LinkTrees;
