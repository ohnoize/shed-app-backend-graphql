import { gql, UserInputError } from 'apollo-server';
import Subject from '../../models/subject.js';

const typeDefs = gql`
  
  extend type Mutation {
    addSubject(name: String!, description: String): Subject
    deleteSubject(id: String!): Subject
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
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
      return subject;
    },
    deleteSubject: async (root, args) => Subject.findByIdAndDelete(args.id)
  }
};

export default {
  typeDefs,
  resolvers
};
