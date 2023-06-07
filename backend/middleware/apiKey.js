const dotenv = require('dotenv');

dotenv.config();
const API_KEY = process.env.API_KEY;

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header('X-CM-API-KEY');

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}

module.exports = { apiKeyMiddleware };
