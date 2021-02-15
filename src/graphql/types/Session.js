import { gql } from 'apollo-server';
import Session from '../../models/session.js';
import User from '../../models/user.js';

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
    allSessions(userID: String): [Session]
    sessionCount: Int
    findSession(id: Int): Session
  }
`;

const resolvers = {
  Session: {
    user: async (root) => {
      const user = await User.findOne({ _id: root.userID });
      return {
        id: user.id,
        username: user.username,
        instrument: user.instrument,
        sessions: user.sessions
      };
    }
  },
  Query: {
    allSessions: async (root, args) => {
      if (args.userID) {
        const sessions = await Session.find({});
        return sessions.filter(s => s.userID === args.userID);
      }
      return Session.find({});
    },
    sessionCount: () => Session.collection.countDocuments(),
    findSession: (root, args) => Session.findOne({ id: args.id }),
  }
};

export default {
  typeDefs,
  resolvers
};
