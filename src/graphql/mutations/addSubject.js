import { gql, UserInputError } from 'apollo-server';
import Subject from '../../models/subject.js';

const typeDefs = gql`
  
  extend type Mutation {
    addSubject(name: String!, description: String): Subject
    deleteSubject(name: String!): Subject
  }
`;

const resolvers = {
  Mutation: {
    addSubject: async (root, args) => {
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
    deleteSubject: async (root, args) => Subject.findOneAndDelete({ name: args.name })
  }
};

export default {
  typeDefs,
  resolvers
};
