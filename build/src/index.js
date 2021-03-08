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
exports.server = exports.schema = void 0;
/* eslint-disable no-console */
const apollo_server_1 = require("apollo-server");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = __importDefault(require("./graphql/schema"));
const user_1 = __importDefault(require("./models/user"));
const config_1 = __importDefault(require("./utils/config"));
console.log('Connectingg to', config_1.default.MONGODB_URI);
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
exports.server = new apollo_server_1.ApolloServer({
    schema: exports.schema,
    introspection: true,
    playground: true,
    context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), config_1.default.SECRET_KEY);
            const currentUser = yield user_1.default.findOne({ _id: decodedToken.id });
            return { currentUser };
        }
        return {};
    }),
});
exports.server.listen({ port: process.env.PORT || config_1.default.PORT }).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`Server ready at ${url}`);
});
