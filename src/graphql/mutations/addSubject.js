import { gql } from 'apollo-server';
import Subject from '../../models/subject.js';

const typeDefs = gql`
  
  extend type Mutation {
    addSubject(name: String!, description: String): Subject
  }
`;

const resolvers = {
  Mutation: {
    addSubject: (root, args) => {
      const subject = new Subject({ ...args });
      subject.timePracticed = 0;
      return subject.save();
    }
  }
};

export default {
  typeDefs,
  resolvers
};
