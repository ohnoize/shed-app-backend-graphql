"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-cycle */
const apollo_server_1 = require("apollo-server");
const lodash_1 = __importDefault(require("lodash"));
const Session_1 = __importDefault(require("./types/Session"));
const Subject_1 = __importDefault(require("./types/Subject"));
const User_1 = __importDefault(require("./types/User"));
const addSession_1 = __importDefault(require("./mutations/addSession"));
const addUser_1 = __importDefault(require("./mutations/addUser"));
const addSubject_1 = __importDefault(require("./mutations/addSubject"));
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
    Session_1.default.typeDefs,
    Subject_1.default.typeDefs,
    User_1.default.typeDefs,
    addSession_1.default.typeDefs,
    addUser_1.default.typeDefs,
    addSubject_1.default.typeDefs,
];
const resolvers = merge(Session_1.default.resolvers, Subject_1.default.resolvers, User_1.default.resolvers, addSession_1.default.resolvers, addUser_1.default.resolvers, addSubject_1.default.resolvers);
const createSchema = () => apollo_server_1.makeExecutableSchema({
    typeDefs,
    resolvers,
});
exports.default = createSchema;
