import { gql, UserInputError } from 'apollo-server';
import Subject from '../../models/subject';
import { ResolverMap } from '../schema';

const typeDefs = gql`
  
  extend type Mutation {
    addSubject(name: String!, description: String): Subject
    deleteSubject(name: String!): Subject
  }
`;

interface Resolvers {
  Mutation: ResolverMap;
}

const resolvers: Resolvers = {
  Mutation: {
    addSubject: async (_root, args) => {
      const subject = new Subject({ ...args });
      subject.timePracticed = 0;
      try {
        await subject.save();
      } catch (error) {
        throw new UserInputError(`Subject ${subject.name} already exists`, {
          invalidArgs: args
        });
      }
      return subject;
    },
    deleteSubject: async (_root, args) => Subject.findOneAndDelete({ name: args.name })
  }
};

export default {
  typeDefs,
  resolvers
};
