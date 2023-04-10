const Cards = require("../utils/database/models/Cards.model");

async function generateRandomString(n) {
  let randomString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  const matchExisting = await Cards.count({where: {card_link: randomString}})
  if(matchExisting) generateRandomString(n)
  console.log(randomString);
  return randomString;
}

async function generateCardLink(n) {
  let randomString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}

module.exports = {
  generateRandomString,
  generateCardLink,
};
