import { gql } from 'apollo-server';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';
import Session, { SessionBaseDocument } from '../../models/session';
import User from '../../models/user';
import { DBUserType } from '../../types';

const typeDefs = gql`
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
    allUsers: () => User.find({}),
    userCount: () => User.collection.countDocuments(),
    findUser: (_root, args: { id: string }) => User.findOne({ id: args.id }),
    me: (_root, _args, context) => context.currentUser,
  },
};

export default {
  typeDefs,
  resolvers,
};
