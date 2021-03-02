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
const apollo_server_1 = require("apollo-server");
const session_js_1 = __importDefault(require("../../models/session.js"));
const user_js_1 = __importDefault(require("../../models/user.js"));
const typeDefs = apollo_server_1.gql `
  type SessionSubject {
    name: String!
    length: Int!
  }
  type Session {
    date: String!
    id: ID!
    totalLength: Int
    individualSubjects: [SessionSubject]
    notes: String
    userID: String!
    user: User
  }
  extend type Query {
    allSessions(userID: String): [Session]
    sessionCount: Int
    findSession(id: Int): Session
  }
`;
const resolvers = {
    Session: {
        user: (root) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_js_1.default.findOne({ _id: root.userID });
            return {
                id: user.id,
                username: user.username,
                instrument: user.instrument,
                sessions: user.sessions
            };
        })
    },
    Query: {
        allSessions: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.userID) {
                const sessions = yield session_js_1.default.find({});
                return sessions.filter(s => s.userID === args.userID);
            }
            return session_js_1.default.find({});
        }),
        sessionCount: () => session_js_1.default.collection.countDocuments(),
        findSession: (_root, args) => session_js_1.default.findOne({ id: args.id }),
    }
};
exports.default = {
    typeDefs,
    resolvers
};
