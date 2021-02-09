require('dotenv').config();

const { PORT } = process.env;
const { MONGODB_URI } = process.env;
const { SECRET_KEY } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET_KEY,
};
