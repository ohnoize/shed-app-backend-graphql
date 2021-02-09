import { gql } from 'apollo-server';
import Subject from '../../models/subject.js';

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
    allSubjects: () => Subject.find({}),
    subjectCount: () => Subject.collection.countDocuments()
  }
};

export default {
  typeDefs,
  resolvers
};
