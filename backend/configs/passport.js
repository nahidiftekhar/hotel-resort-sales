const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const { getSingleUser } = require("../services/user-services");
const { secretConfig } = require("./secrets.config");
const {
  issueAccessToken,
  checkRefreshTokenValidity,
} = require("../services/utils/jwt-functions");

const pathToKey = path.join(__dirname, "../configs/", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

//Cookes extractor - Access Token
const accessTokenExtractor = (req) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies[secretConfig.ACCESS_TOKEN];
  }
  return jwt;
};

//Cookes extractor - Refresh Token
const refreshTokenExtractor = (req) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.body.token;
  }
  return jwt;
};

//Reassign Access Token
const reassignAccessToken = (email, type) => {
  const newAccessToken = issueAccessToken(email, type);
  return newAccessToken;
};

// Options for passport-jwt
const PassportJwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    accessTokenExtractor,
  ]),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
  passReqToCallback: true,
};

//Entry file will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(PassportJwtOptions, async function (
      req,
      jwt_payload,
      done
    ) {
      if (jwt_payload) {
        //If a access token is available
        let accessTokenValidity = jwt_payload.exp > Date.now();
        const refreshTokenValidity = checkRefreshTokenValidity(req);

        //If refresh token invalid
        if (!refreshTokenValidity.tokenValidity) {
          return done(null, {status: 2, user: jwt_payload});
        }
        //If access token is expired
        else if (!accessTokenValidity && refreshTokenValidity.tokenValidity) {
          const newAccessToken = reassignAccessToken(
            refreshTokenValidity.refreshToken.email,
            refreshTokenValidity.refreshToken.userType
          );
          if (
            req.body.accessType === refreshTokenValidity.refreshToken.userType
          )
            return done(null, {status: 3, user: jwt_payload}, newAccessToken);
          else return done(null, {status: 4, user: jwt_payload});
        } else if (accessTokenValidity && refreshTokenValidity.tokenValidity) {
          if (req.body.accessType === jwt_payload.userType) {
            return done(null, {status: 1, user: jwt_payload});
          } else {
            return done(null, {status: 4, user: jwt_payload});
          }
        }
      } else {
        //If no access token present
        return done(null, {status: 2, user: null});
      }
    })
  );
};
