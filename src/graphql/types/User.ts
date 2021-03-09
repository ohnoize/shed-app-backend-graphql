import { AuthenticationError, gql } from 'apollo-server';
// eslint-disable-next-line import/no-cycle
import { Context, ResolverMap } from '../schema';
import Session, { SessionBaseDocument } from '../../models/session';
import User, { UserBaseDocument } from '../../models/user';
import { DBUserType } from '../../types';

const typeDefs = gql`
  type SubjectNote {
    date: String!
    notes: String!
  }
  type Goal {
    description: String!,
    subject: String!,
    targetTime: Int!,
    deadline: String,
    passed: Boolean!
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
    timePracticed: Int!
    goals: [Goal]
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
    findUser(id: String): User
    me: User
  }
`;

interface Resolvers {
  Query: ResolverMap;
  User: ResolverMap;
}
const resolvers: Resolvers = {
  User: {
    sessions: async (root: DBUserType): Promise<SessionBaseDocument[]> => {
      const sessions = await Session.find({ user: root.id });
      return sessions;
    },
  },
  Query: {
    allUsers: async (_root: DBUserType,
      _args: void, context: Context): Promise<UserBaseDocument[]> => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated');
      }
      const user = await User.find({});
      return user;
    },
    userCount: () => User.collection.countDocuments(),
    findUser: async (_root: DBUserType,
      args: { id: string }, context: Context): Promise<UserBaseDocument> => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated');
      }
      const user = await User.findOne({ _id: args.id });
      return user;
    },
    me: (_root, _args, context) => context.currentUser,
  },
};

export default {
  typeDefs,
  resolvers,
};
