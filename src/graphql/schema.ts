/* eslint-disable import/no-cycle */
import { makeExecutableSchema, gql } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import pkg from 'lodash';
import Session from './types/Session';
import Subject from './types/Subject';
import User from './types/User';
import addSession from './mutations/addSession';
import addUser from './mutations/addUser';
import addSubject from './mutations/addSubject';

const { merge } = pkg;

export interface Context {
  models: {
    user: typeof User;
    subject: typeof Subject;
    session: typeof Session;
  };
  currentUser: typeof User
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolverFn = (root: any, args: any, ctx: Context) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

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
  addSubject.typeDefs,
];

const resolvers = merge(
  Session.resolvers,
  Subject.resolvers,
  User.resolvers,
  addSession.resolvers,
  addUser.resolvers,
  addSubject.resolvers,
);

const createSchema = (): GraphQLSchema => makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default createSchema;
