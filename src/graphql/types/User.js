import { gql } from 'apollo-server';
import Session from '../../models/session.js';
import User from '../../models/user.js';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    instrument: String
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
    sessions: async (root) => {
      const sessions = await Session.find({ user: root.id });
      return sessions;
    }
  },
  Query: {
    allUsers: () => User.find({}),
    userCount: () => User.collection.countDocuments(),
    findUser: (root, args) => User.findOne({ id: args.id }),
    me: (root, args, context) => context.currentUser
  }
};

export default {
  typeDefs,
  resolvers
};
