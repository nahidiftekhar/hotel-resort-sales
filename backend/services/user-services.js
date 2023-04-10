const bcrypt = require("bcrypt");
const passport = require("passport");
const crypto = require("crypto");

const db = require("./utils/db");
const sendMail = require("./utils/send-email");
const { secretConfig } = require("../configs/secrets.config");
const saltRounds = secretConfig.SALT_ROUNDS;
const {
  issueAccessToken,
  issueRefreshToken,
} = require("./utils/jwt-functions");
const { error } = require("console");

async function testDb(req, res, next) {
  const dbResult = await db.testQuery();
  return res.json(dbResult);
}

async function addUserPlainText(req, res, next) {
  const { email, passPlain, type, userName } = req.body;
  const userType = type ? type : 0;
  const existingRecord = await db.findUserByEmail(email);
  if (existingRecord)
    return res.json({
      successStatus: false,
      message: existingRecord.is_deactive ? "This account has not been verified, please check email to verify and activate account" : "Email exists for same type user.",
      type: userType,
      emailPending: existingRecord.is_deactive,
    });
  bcrypt.hash(passPlain, saltRounds, async function (err, hash) {
    const dbResult = await db.addNewUser(userType, email, hash, userName);

    if (dbResult.status) {
      //Add token to DB: useractivation table
      const token = crypto.randomBytes(20).toString("hex");
      await db.addUserVerificationToken(dbResult.result.user_id, token);

      const messageBody =
        "<img style='width:250px;' src='cid:logo' /> <br />Hello,<br /><br />Please verify your email address using the code below to complete account setup.<br />" + 
        "<a href='" + "https://" + req.headers.host + "/user-management/verify-email/" +  token + "/" + dbResult.result.user_id + 
        "'>https://" + req.headers.host + "/user-management/verify-email/" + token + "/" + dbResult.result.user_id + "</a>" +
        "<br /><br />Thank You<br />Smart Taps" +
        "<br /><br />If you are having issues with your account, please contact support at <a href='mailto:support@smarttaps.co'>support@smarttaps.co</a> or visit <a href='www.smarttaps.co'>www.smarttaps.co</a> for more information.";

      const mailSubject = "Welcome to Smarttaps - Email Verifcation";
      await sendMail.sendSingleEmail(email, messageBody, mailSubject);
    }

    const successStatus = dbResult.status ? true : false;
    const message = dbResult.status ? dbResult.result.user_id : dbResult.error;
    return res.json({
      successStatus: successStatus,
      message: message,
      type: userType,
    });
  });
}

async function validateEmail(req, res, next) {
  const dbResult = await db.validateUserToken(req.params.token, req.params.userId);
  if (dbResult)
    res.render("email-verified", { render: 1 });
  else res.render("email-verified", { render: 2 });
}

async function resendValidation(req, res, next) {
  const dbResult = await db.getTokenbyEmail(req.params.email);
  if (dbResult) console.log("dbResult: " + JSON.stringify(dbResult));

  const messageBody =
    "<img style='width:250px;' src='cid:logo' /> <br />Hello,<br /><br />Please verify your email address using the code below to complete account setup.<br />" +
    "<a href='" +
    "https://" +
    req.headers.host +
    "/user-management/verify-email/" +
    dbResult.token +
    "/" +
    dbResult.user_id +
    "'>https://" +
    req.headers.host +
    "/user-management/verify-email/" +
    dbResult.token +
    "/" +
    dbResult.user_id +
    "</a>" +
    "<br /><br />Thank You<br />Smart Taps" +
    "<br /><br />If you are having issues with your account, please contact support at <a href='mailto:support@smarttaps.co'>support@smarttaps.co</a> or visit <a href='www.smarttaps.co'>www.smarttaps.co</a> for more information.";

  const mailSubject = "Welcome to Smarttaps - Email Verifcation";
  await sendMail.sendSingleEmail(req.params.email, messageBody, mailSubject);

  return res.json({
    successStatus: false,
    message: "Verification mail sent. Please check mail including spam folder.",
    type: 0,
    emailPending: true,
  });
}

async function loginUser(req, res, next) {
  const { email, type, passPlain } = req.body;
  const dbResult = await db.findUserByEmail(email);
  if (!dbResult)
    return res.json({
      successStatus: false,
      type: 0,
      reason: "Your entered email/password was not found",
    });
  if (dbResult.is_deactive)
  return res.json({
    successStatus: false,
    type: 0,
    reason: "This account has not been verified, please check email to verify and activate account",
  });
  let refreshToken = null;
  const passwordHashDb = dbResult.password;
  const userTypeDb = dbResult.user_type;
  bcrypt.compare(passPlain, passwordHashDb, function (err, result) {
    if (result) {
      refreshToken = issueRefreshToken(email, userTypeDb);
      res.clearCookie(secretConfig.ACCESS_TOKEN);
      res.cookie(secretConfig.ACCESS_TOKEN, issueAccessToken(email, userTypeDb, dbResult.username, dbResult.user_id), {
        httpOnly: true,
        sameSite: "None",
        secure: true, //reset to true in https
        maxAge: secretConfig.ACCESS_TOKEN_EXPIRY,
      });
    }
    const reasonText = result ? "User Authenticated" : "Your entered email/password was not found";
    return res.json({
      successStatus: result,
      type: userTypeDb,
      reason: reasonText,
      CMRT: refreshToken,
    });
  });
}

function logoutUser(req, res, next) {
  res.clearCookie(secretConfig.ACCESS_TOKEN);
  res.send({
    logoutStatus: true,
  });
}

function authorizeAccess(req, res, next) {
  passport.authenticate(
    "jwt",
    { session: false },
    function (err, accessGranted, info) {
      let message = "Page access granted";
      let forceLogout = false;
      let success = true;
      if (err) {
        return next(err);
      }
      if (accessGranted.status === 2) {
        res.clearCookie(secretConfig.ACCESS_TOKEN);
        message = "Token expired";
        forceLogout = true;
        success = false;
      }
      if (accessGranted.status === 3) {
        res.clearCookie(secretConfig.ACCESS_TOKEN);
        res.cookie(secretConfig.ACCESS_TOKEN, info, {
          httpOnly: true,
          sameSite: "None",
          secure: true, //reset to true in https
          maxAge: secretConfig.REFRESH_TOKEN_EXPIRY,
        });
      }
      if (accessGranted.status === 4) {
        message = "Page access denied";
        success = false;
      }
        accessGranted
        ? res.send({
            success: success,
            message: accessGranted.user,
            forceLogout: forceLogout,
          })
        : res.send({
            success: false,
            message: "authentication failed",
            forceLogout: true,
          });
    }
  )(req, res, next);
}

async function forgotPassword(req, res, next) {
  const userFound = await db.findUserByEmail(req.body.email_id);
  if (!userFound) {
    return res.json({
      successStatus: 0,
      message: "No user found for the email ID",
    });
  }

  //Add token to DB
  const token = crypto.randomBytes(20).toString("hex");
  await db.addPasswordToken(userFound.user_id, token);

  //Send email
  const messageBody =
    "<img style='width:250px;' src='cid:logo' /> <br />Hello,<br /><br />A request is received to reset the password for your account on Smarttaps App. <br />To confirm and reset the password, please click on the link below:<br />" + 
    "<a href='" + "https://" + req.headers.host + "/user-management/reset/" +  token + "/" + userFound.user_id + 
    "'>https://" + req.headers.host + "/user-management/reset/" + token + "/" + userFound.user_id + "</a>" +
    "<br /><br /> If you did not request this, please ignore this email and your password will remain unchanged. <br /><br />Thank You<br />Smart Taps" +
    "<br /><br />If you are having issues with your account, please contact support at <a href='mailto:support@smarttaps.co'>support@smarttaps.co</a> or visit <a href='www.smarttaps.co'>www.smarttaps.co</a> for more information.";

  const mailSubject = "Welcome to Smarttaps - Password Reset";
  await sendMail.sendSingleEmail(req.body.email_id, messageBody, mailSubject);
  return res.json({
    successStatus: 1,
  });
}

async function checkPwToken(req, res, next) {
  const dbResult = await db.findPasswordToken(req.params.token, req.params.userId);
  if (dbResult)
    res.render("change-password", { user: dbResult.user_id, render: 1 });
  else res.render("change-password", { render: 2 });
}

async function setPassword(req, res, next) {
  const { new_password, user_id } = req.body;
  bcrypt.hash(new_password, saltRounds, async function (err, hash) {
    try {
      const dbResult = await db.updatePassword(hash, user_id);
      res.render("change-password", { render: dbResult? 3:4 });
    } catch (error) {
      res.render("change-password", { render: 4 });
    }
  });
}

module.exports = {
  addUserPlainText,
  validateEmail,
  loginUser,
  logoutUser,
  authorizeAccess,
  testDb,
  forgotPassword,
  checkPwToken,
  setPassword,
  resendValidation
};
