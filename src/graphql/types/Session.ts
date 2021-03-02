import { gql } from 'apollo-server';
import Session, { SessionBaseDocument } from '../../models/session';
import User, { UserBaseDocument } from '../../models/user';
import { DBUserType, DBSessionType } from '../../types';

// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';

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
        subjectNotes: user.subjectNotes,
      };
    },
  },
  Query: {
    allSessions: async (_root:void, args: { userID: string }): Promise<SessionBaseDocument[]> => {
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
