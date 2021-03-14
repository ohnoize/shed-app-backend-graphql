"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
/* eslint-disable no-console */
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = __importDefault(require("./graphql/schema"));
const user_1 = __importDefault(require("./models/user"));
const auth_1 = require("./auth");
const config_1 = __importDefault(require("./utils/config"));
const sendRefreshToken_1 = require("./sendRefreshToken");
console.log('Connectingg to', config_1.default.MONGODB_URI);
const app = express_1.default();
app.use(cors_1.default());
app.use(cookie_parser_1.default());
app.get('/', (_req, res) => res.send('Yello!'));
app.post('/refresh_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.cookies);
    const token = req.cookies.saID;
    if (!token) {
        return res.send({ success: false, token: '' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decodedRefreshToken = null;
    try {
        decodedRefreshToken = jsonwebtoken_1.default.verify(token, config_1.default.REFRESH_SECRET_KEY);
    }
    catch (e) {
        return res.send({ success: false, token: '' });
    }
    const user = yield user_1.default.findOne({ _id: decodedRefreshToken.id });
    if (!user) {
        return res.send({ success: false, token: '' });
    }
    const userForToken = {
        username: user.username,
        id: user.id,
    };
    const userForRefreshToken = {
        id: user.id,
    };
    sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(userForRefreshToken));
    return res.send({ success: true, token: auth_1.createNewToken(userForToken) });
}));
mongoose_1.default.connect(config_1.default.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});
exports.schema = schema_1.default();
const server = new apollo_server_express_1.ApolloServer({
    schema: exports.schema,
    introspection: true,
    playground: true,
    context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), config_1.default.SECRET_KEY);
            const currentUser = yield user_1.default.findOne({ _id: decodedToken.id });
            return { currentUser, res, req };
        }
        return { res, req };
    }),
});
server.applyMiddleware({ app });
app.listen({ port: process.env.PORT || config_1.default.PORT }, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready at ${server.graphqlPath}`);
});
