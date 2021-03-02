import { gql, UserInputError } from 'apollo-server';
import Session, { SessionBaseDocument } from '../../models/session';
import User from '../../models/user';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';
import { SessionType, DBSessionType } from '../../types';

const typeDefs = gql`
  input sessionSubjectInput {
    name: String
    length: Int
  } 
  
  input createSessionInput {
    totalLength: Int!
    notes: String
    individualSubjects: [sessionSubjectInput]
    userID: String!
  }
  extend type Mutation {
    addSession(
      date: String!
      totalLength: Int!,
      notes: String,
      individualSubjects: [sessionSubjectInput],
      userID: String!
    ): Session
    deleteSession(id: String!): Session
    deleteSessionByNotes(notes: String!): Session
  }
`;

interface Resolvers {
  Mutation: ResolverMap;
}

const resolvers: Resolvers = {
  Mutation: {
    addSession: async (_root: DBSessionType, args: SessionType): Promise<SessionBaseDocument> => {
      // console.log(args.userID);
      const user = await User.findOne({ _id: args.userID });
      // console.log(user);
      const session = new Session({ ...args, user: user.id });
      // console.log(session);
      try {
        await session.save();
        user.sessions = user.sessions.concat(session.id);
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return session;
    },
    deleteSession: async (_root, args) => Session.findByIdAndDelete(args.id),
    deleteSessionByNotes: async (_root, args) => Session.findOneAndDelete({ notes: args.notes }),
  },
};

export default {
  typeDefs,
  resolvers,
};
