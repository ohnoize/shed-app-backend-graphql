import { AuthenticationError, gql } from 'apollo-server';
import Session, { SessionBaseDocument } from '../../models/session';
import User, { UserBaseDocument } from '../../models/user';
import { DBUserType, DBSessionType } from '../../types';

// eslint-disable-next-line import/no-cycle
import { Context, ResolverMap } from '../schema';

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

interface Resolvers {
  Query: ResolverMap;
  Session: ResolverMap;
}

const resolvers: Resolvers = {
  Session: {
    user: async (root: DBSessionType): Promise<DBUserType> => {
      const user: UserBaseDocument = await User.findOne({ _id: root.userID });
      return {
        id: user.id,
        joined: user.joined,
        username: user.username,
        instrument: user.instrument,
        sessions: user.sessions,
        mySubjects: user.mySubjects,
        goals: user.goals,
        timePracticed: user.timePracticed,
      };
    },
  },
  Query: {
    // eslint-disable-next-line max-len
    allSessions: async (_root:DBSessionType, args: { userID: string }, context: Context): Promise<SessionBaseDocument[]> => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated');
      }
      if (args.userID) {
        const sessions = await Session.find({});
        return sessions.filter(s => s.userID === args.userID);
      }
      return Session.find({});
    },
    sessionCount: () => Session.collection.countDocuments(),
    findSession: (_root, args) => Session.findOne({ id: args.id }),
  },
};

export default {
  typeDefs,
  resolvers,
};
