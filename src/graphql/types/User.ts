import { gql } from 'apollo-server';
import { ResolverMap } from '../schema';
import Session from '../../models/session';
import User from '../../models/user';

const typeDefs = gql`
  type SubjectNote {
    subjectID: String!
    date: String!
    notes: String!
  }
  type User {
    id: ID!
    username: String!
    instrument: String
    subjectNotes: [SubjectNote]
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


interface Resolvers {
  Query: ResolverMap;
  User: ResolverMap;
}
const resolvers: Resolvers = {
  User: {
    sessions: async (root) => {
      const sessions = await Session.find({ user: root.id });
      return sessions;
    }
  },
  Query: {
    allUsers: () => User.find({}),
    userCount: () => User.collection.countDocuments(),
    findUser: (_root, args: { id: string }) => User.findOne({ id: args.id }),
    me: (_root, _args, context) => context.currentUser
  }
};

export default {
  typeDefs,
  resolvers
};
