// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { PORT } = process.env;
let { MONGODB_URI, APP_URI } = process.env;
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
  APP_URI = 'http://localhost:3000';
}

if (process.env.NODE_ENV === 'development') {
  APP_URI = 'http://localhost:3000';
}

export default {
  PORT,
  APP_URI,
  MONGODB_URI,
  SECRET_KEY,
  REFRESH_SECRET_KEY,
};
