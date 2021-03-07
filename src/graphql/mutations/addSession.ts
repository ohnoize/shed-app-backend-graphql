import { gql, UserInputError } from 'apollo-server';
import Session, { SessionBaseDocument } from '../../models/session';
import Subject from '../../models/subject';
import User from '../../models/user';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';
import { DBSessionType, MySubjectType, SessionInput } from '../../types';

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
    addSession: async (_root: DBSessionType, args: SessionInput): Promise<SessionBaseDocument> => {
      const user = await User.findOne({ _id: args.userID });
      const session = new Session({ ...args, user: user.id });
      session.date = new Date().toString();
      try {
        await session.save();
        user.sessions = user.sessions.concat(session.id);
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      session.individualSubjects.forEach(async (i) => {
        const dbSubject = await Subject.findOne({ name: i.name });
        dbSubject.timePracticed += i.length;
        await dbSubject.save();
        const subject = user.mySubjects.find((s) => s.subjectName === i.name);
        if (subject) {
          subject.timePracticed += i.length;
          user.mySubjects.map((s) => (s.subjectName !== subject.subjectName ? s : subject));
        } else {
          const newSubject: MySubjectType = {
            subjectID: dbSubject.id,
            subjectName: i.name,
            timePracticed: i.length,
            subjectNotes: [],
          };
          user.mySubjects = [
            ...user.mySubjects,
            newSubject,
          ];
        }
      });
      try {
        console.log(user);
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
