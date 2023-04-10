const secretConfig = {
  SALT_ROUNDS: 10,
  SESSION_COOKIE_NAME: "NIE_Cookie",
  ACCESS_TOKEN_EXPIRY: 43200000,
  REFRESH_TOKEN_EXPIRY: 864000000,
  ACCESS_TOKEN: "CMAT",
  REFRESH_TOKEN: "CMRT"
};
module.exports = { secretConfig };
