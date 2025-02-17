import { gql } from 'apollo-server';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';
import Subject from '../../models/subject';

const typeDefs = gql`
  type SubjectLink {
    url: String!
    description: String!
  }
  type Subject {
    id: ID!
    name: String
    description: String
    timePracticed: Int!
    links: [SubjectLink]
  }
  extend type Query {
    allSubjects: [Subject]
    subjectCount: Int
  }
`;

interface Resolvers {
  Query: ResolverMap;
}

const resolvers: Resolvers = {
  Query: {
    allSubjects: () => Subject.find({}),
    subjectCount: (): Promise<number> => Subject.collection.countDocuments(),
  },
};

export default {
  typeDefs,
  resolvers,
};
