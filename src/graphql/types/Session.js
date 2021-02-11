import { gql } from 'apollo-server';
import Session from '../../models/session.js';

const typeDefs = gql`
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
    allSessions: [Session]
    sessionCount: Int
    findSession(id: Int): Session
  }
`;

const resolvers = {

  Query: {
    allSessions: () => Session.find({}),
    sessionCount: () => Session.collection.countDocuments(),
    findSession: (root, args) => Session.findOne({ id: args.id })
  }
};

export default {
  typeDefs,
  resolvers
};
