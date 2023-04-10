const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const PRIV_KEY = fs.readFileSync(
  path.join(__dirname, "../../configs/", "id_rsa_priv.pem"),
  "utf8"
);
const PUB_KEY = fs.readFileSync(
  path.join(__dirname, "../../configs/", "id_rsa_pub.pem"),
  "utf8"
);
const { secretConfig } = require("../../configs/secrets.config");

function issueAccessToken(emailId, userType, userName, userId) {
  const payload = {
    tokenType: "at",
    email: emailId,
    userType: userType,
    userName: userName,
    userId: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: secretConfig.ACCESS_TOKEN_EXPIRY,
    algorithm: "RS256",
  });
  return signedToken;
}

function issueRefreshToken(emailId, userType) {
  const payload = {
    tokenType: "rt",
    email: emailId,
    userType: userType,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: secretConfig.REFRESH_TOKEN_EXPIRY,
    algorithm: "RS256",
  });
  return signedToken;
}

function decodeJwt(signedJwt) {
  const decodedJwt = jsonwebtoken.verify(signedJwt, PUB_KEY);
  console.log(decodedJwt);
}

const checkRefreshTokenValidity = (req) => {
  let refreshToken
  if (req.body.token) {
    refreshToken = jsonwebtoken.verify(req.body.token, PUB_KEY);
  }
  const tokenValidity = refreshToken
    ? refreshToken.exp >= Date.now()
    : false;
  return { refreshToken, tokenValidity };
};

const reassignAccessToken = (req) => {
  const refreshToken=checkRefreshTokenValidity(req);
  if(refreshToken.refreshTokenValidity){
    return issueAccessToken(refreshToken.refreshToken.email, refreshToken.refreshToken.userType)
  }
  else return false;
}

module.exports = {
  issueAccessToken,
  issueRefreshToken,
  decodeJwt,
  checkRefreshTokenValidity,
  reassignAccessToken
};
