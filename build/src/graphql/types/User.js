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
const session_1 = __importDefault(require("../../models/session"));
const user_1 = __importDefault(require("../../models/user"));
const typeDefs = apollo_server_1.gql `
  type SubjectNote {
    date: String!
    notes: String!
  }
  type MySubject {
    subjectID: String!
    subjectName: String!
    timePracticed: Int!
    subjectNotes: [SubjectNote]
  }
  type User {
    id: ID!
    username: String!
    instrument: String
    mySubjects: [MySubject]
    joined: String!
    sessions: [Session]
  }
  type AuthPayload {
    token: String!
    user: User
  }
  extend type Query {
    allUsers: [User]
    userCount: Int
    findUser(id: Int): User
    me: User
  }
`;
const resolvers = {
    User: {
        sessions: (root) => __awaiter(void 0, void 0, void 0, function* () {
            const sessions = yield session_1.default.find({ user: root.id });
            return sessions;
        }),
    },
    Query: {
        allUsers: () => user_1.default.find({}),
        userCount: () => user_1.default.collection.countDocuments(),
        findUser: (_root, args) => user_1.default.findOne({ id: args.id }),
        me: (_root, _args, context) => context.currentUser,
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
