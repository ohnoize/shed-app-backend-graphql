"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const subject_1 = __importDefault(require("../../models/subject"));
const typeDefs = apollo_server_1.gql `
  type SubjectLink {
    url: String!
    description: String!
  }
  type Subject {
    id: ID!
    name: String
    description: String
    timePracticed: Int!
    links: [SubjectLink]
  }
  extend type Query {
    allSubjects: [Subject]
    subjectCount: Int
  }
`;
const resolvers = {
    Query: {
        allSubjects: () => subject_1.default.find({}),
        subjectCount: () => subject_1.default.collection.countDocuments(),
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
