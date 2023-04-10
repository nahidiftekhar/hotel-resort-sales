const Sequelize = require("sequelize");
const db = require("../index");

const Users = db.define("users", {
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  registered_email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  is_deactive: {
    type: Sequelize.BOOLEAN,
    default: true,
  },
  user_type: {
    type: Sequelize.INTEGER,
    default: 0,
  }
});

Users.sync({alter: true}).then(() => {
  console.log("users table synced");
});

module.exports = Users;
