"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
const sendRefreshToken = (res, token) => {
    if (res) {
        res.cookie('saID', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: false,
            maxAge: 100000000,
            path: '/refresh_token',
        });
    }
};
exports.sendRefreshToken = sendRefreshToken;
