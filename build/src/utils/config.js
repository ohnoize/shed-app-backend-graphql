"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const { PORT } = process.env;
let { MONGODB_URI } = process.env;
const { SECRET_KEY } = process.env;
if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
}
exports.default = {
    PORT,
    MONGODB_URI,
    SECRET_KEY,
};
