"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const subject_js_1 = __importDefault(require("../../models/subject.js"));
const typeDefs = apollo_server_1.gql `
  type Subject {
    id: ID!
    name: String
    description: String
    timePracticed: Int
  }
  extend type Query {
    allSubjects: [Subject]
    subjectCount: Int
  }
`;
const resolvers = {
    Query: {
        allSubjects: () => subject_js_1.default.find({}),
        subjectCount: () => subject_js_1.default.collection.countDocuments()
    }
};
exports.default = {
    typeDefs,
    resolvers
};
