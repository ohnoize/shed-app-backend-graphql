import { makeExecutableSchema, gql } from 'apollo-server';
import pkg from 'lodash';
import Session from './types/Session.js';
import Subject from './types/Subject.js';
import User from './types/User.js';
import addSession from './mutations/addSession.js';
import addUser from './mutations/addUser.js';
import addSubject from './mutations/addSubject.js';

const { merge } = pkg;

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

const typeDefs = [
  rootTypeDefs,
  Session.typeDefs,
  Subject.typeDefs,
  User.typeDefs,
  addSession.typeDefs,
  addUser.typeDefs,
  addSubject.typeDefs
];

const resolvers = merge(
  Session.resolvers,
  Subject.resolvers,
  User.resolvers,
  addSession.resolvers,
  addUser.resolvers,
  addSubject.resolvers
);

const createSchema = () => makeExecutableSchema({
  typeDefs,
  resolvers
});

export default createSchema;
