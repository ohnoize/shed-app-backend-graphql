import { gql, UserInputError } from 'apollo-server';
import Subject, { SubjectBaseDocument } from '../../models/subject';
import User from '../../models/user';
import { AddSubjectType, DBSubjectType, MySubjectType } from '../../types';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';

const typeDefs = gql`
  
  extend type Mutation {
    addSubject(name: String!, description: String, userID: String): Subject
    deleteSubject(name: String!): Subject
  }
`;

interface Resolvers {
  Mutation: ResolverMap;
}

const resolvers: Resolvers = {
  Mutation: {
    // eslint-disable-next-line max-len
    addSubject: async (_root: DBSubjectType, args: AddSubjectType): Promise<SubjectBaseDocument> => {
      const subject = new Subject({ ...args });
      subject.timePracticed = 0;
      const user = await User.findOne({ _id: args.userID });
      const userSubject: MySubjectType = {
        subjectID: subject.id,
        subjectName: subject.name,
        timePracticed: 0,
        subjectNotes: [],
      };
      user.mySubjects = [
        ...user.mySubjects,
        userSubject,
      ];
      // console.log(user);
      try {
        await subject.save();
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return subject;
    },
    deleteSubject: async (_root, args) => Subject.findOneAndDelete({ name: args.name }),
  },
};

export default {
  typeDefs,
  resolvers,
};
