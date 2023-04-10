const Sequelize = require("sequelize");
const db = require("../index");

const Profiles = db.define("profiles", {
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
  basic_info: {
    type: Sequelize.JSON,
    //name, title, address, organization
  },
  vcard_id: {
    type: Sequelize.INTEGER
  },
  contact_info: {
    type: Sequelize.JSON,
  },
  other_info: {
    type: Sequelize.JSON,
  },
  theme_element: {
    type: Sequelize.JSON,
  }
});

Profiles.sync({alter: true}).then(() => {
  console.log("profile table synced");
});

module.exports = Profiles;
