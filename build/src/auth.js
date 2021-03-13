"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createNewToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./utils/config"));
const createNewToken = (userForToken) => (jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET_KEY, { expiresIn: '12h' }));
exports.createNewToken = createNewToken;
const createRefreshToken = (userForToken) => (jsonwebtoken_1.default.sign(userForToken, config_1.default.REFRESH_SECRET_KEY, { expiresIn: '7d' }));
exports.createRefreshToken = createRefreshToken;
