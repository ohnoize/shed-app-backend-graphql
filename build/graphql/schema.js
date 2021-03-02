"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const lodash_1 = __importDefault(require("lodash"));
const Session_js_1 = __importDefault(require("./types/Session.js"));
const Subject_js_1 = __importDefault(require("./types/Subject.js"));
const User_js_1 = __importDefault(require("./types/User.js"));
const addSession_js_1 = __importDefault(require("./mutations/addSession.js"));
const addUser_js_1 = __importDefault(require("./mutations/addUser.js"));
const addSubject_js_1 = __importDefault(require("./mutations/addSubject.js"));
const { merge } = lodash_1.default;
const rootTypeDefs = apollo_server_1.gql `
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;
const typeDefs = [
    rootTypeDefs,
    Session_js_1.default.typeDefs,
    Subject_js_1.default.typeDefs,
    User_js_1.default.typeDefs,
    addSession_js_1.default.typeDefs,
    addUser_js_1.default.typeDefs,
    addSubject_js_1.default.typeDefs
];
const resolvers = merge(Session_js_1.default.resolvers, Subject_js_1.default.resolvers, User_js_1.default.resolvers, addSession_js_1.default.resolvers, addUser_js_1.default.resolvers, addSubject_js_1.default.resolvers);
const createSchema = () => apollo_server_1.makeExecutableSchema({
    typeDefs,
    resolvers
});
exports.default = createSchema;
