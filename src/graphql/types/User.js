const { gql } = require('apollo-server');
const users = require('../../../data/users')

const typeDefs = gql`
  type User {
    id: Int
    username: String
  }
  extend type Query {
    allUsers: [User]
    userCount: Int
  }
`
const resolvers = {
  Query: {
    allUsers: () => users,
    userCount: () => users.length
  }
}

module.exports = {
  typeDefs,
  resolvers
}
