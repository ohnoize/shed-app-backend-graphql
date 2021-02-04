const { makeExecutableSchema, gql } = require('apollo-server');
const { merge } = require('lodash');

const Session = require('./types/Session')
const Subject  = require('./types/Subject')
const User = require('./types/User')

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`

const typeDefs = [
  rootTypeDefs,
  Session.typeDefs,
  Subject.typeDefs,
  User.typeDefs
];

const resolvers = merge(
  Session.resolvers,
  Subject.resolvers,
  User.resolvers
)

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

module.exports = schema;