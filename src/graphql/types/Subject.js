import { gql } from 'apollo-server';
import subjects from '../../../data/subjects.js';

const typeDefs = gql`
  type Subject {
    id: ID!
    name: String
    description: String
    timePracticed: Int
  }
  extend type Query {
    allSubjects: [Subject]
    subjectCount: Int
  }
`;

const resolvers = {
  Query: {
    allSubjects: () => subjects,
    subjectCount: () => subjects.length
  }
};

export default {
  typeDefs,
  resolvers
};
