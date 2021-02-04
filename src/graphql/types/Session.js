const { gql } = require('apollo-server');
const sessions = require('../../../data/sessions')

const typeDefs = gql`
  type Session {
    id: Int
    totalLength: Int
    notes: String
  }
  extend type Query {
    allSessions: [Session]
    sessionCount: Int
  }
`

const resolvers = {
  Query: {
    allSessions: () => sessions,
    sessionCount: () => sessions.length
  }
}

module.exports = {
  typeDefs,
  resolvers
}