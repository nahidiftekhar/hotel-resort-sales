const { Sequelize, Op } = require("sequelize");
const { credentials, usertypes } = require("../../database/models");

async function testQuery(tableName) {
  try {
    const result = await tableName.findAll();
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function findUserByUsernameDb(userName) {
  try {
    const results = await credentials.findOne({
      where: { username: userName },
    });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
  }
}

async function addNewUser(type_id, email_id, pass_token, userName) {
  try {
    const result = await credentials.create({
      user_type_id: type_id,
      username: userName,
      email: email_id,
      password: pass_token,
      is_deactive: false,
      pass_change_required: true,
    });
    return { status: 1, result };
  } catch (error) {
    console.log("Error occured: " + error);
    return { status: 0, error };
  }
}

async function changePassword(newPassword, userName) {
  try {
    const dbResult = await credentials.update(
      { password: newPassword, pass_change_required: false },
      {
        where: { username: userName },
      }
    );

    return dbResult;
  } catch (error) {
    console.log("Error changing password: " + error);
    return 0;
  }
}

async function addUserVerificationToken(user_id, token) {
  await UserActivationCodes.destroy({
    where: {
      user_id: user_id,
    },
  });
  try {
    await UserActivationCodes.create({
      user_id: user_id,
      token: token,
      validity: Date.now() + 172800000,
      is_confirmed: false,
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

async function validateUserToken(token, userId) {
  try {
    const matchCode = await UserActivationCodes.count({
      where: {
        token: token,
        user_id: userId,
        is_confirmed: false,
        validity: { [Op.gt]: Date.now() },
      },
    });
    if (matchCode) {
      await UserActivationCodes.update(
        { is_confirmed: true },
        {
          where: {
            token: token,
            user_id: userId,
          },
        }
      );
      await Users.update(
        { is_deactive: false },
        {
          where: {
            user_id: userId,
          },
        }
      );
      return 1;
    }
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function getTokenbyEmail(email) {
  try {
    const matchCode = await UserActivationCodes.findOne({
      raw: true,
      attributes: ["token", "user.user_id"],
      include: {
        model: Users,
        where: {
          registered_email: email,
        },
        attributes: [],
      },
    });
    return matchCode;
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function addPasswordToken(user_id, token) {
  await UserActivationCodes.destroy({
    where: {
      user_id: user_id,
    },
  });
  try {
    await UserActivationCodes.create({
      user_id: user_id,
      token: token,
      is_confirmed: false,
      validity: Date.now() + 3600000,
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

async function findPasswordToken(token) {
  try {
    const results = await UserActivationCodes.findOne({
      where: {
        token: token,
        is_confirmed: false,
        validity: { [Op.gt]: Date.now() },
      },
    });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function updatePassword(new_password, userId) {
  try {
    await Users.update({ password: new_password }, { where: { id: userId } });
    await UserActivationCodes.update(
      { is_confirmed: true },
      {
        where: {
          user_id: userId,
        },
      }
    );
    return 1;
  } catch (error) {
    console.log("Error changing password: " + error);
    return 0;
  }
}

module.exports = {
  testQuery,
  findUserByUsernameDb,
  addNewUser,
  changePassword,
};
