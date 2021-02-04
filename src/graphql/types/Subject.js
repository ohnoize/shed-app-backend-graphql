const { gql } = require('apollo-server');
const subjects = require('../../../data/subjects')


const typeDefs = gql`
  type Subject {
    id: Int
    name: String
    description: String
    timePracticed: Int
  }
  extend type Query {
    allSubjects: [Subject]
    subjectCount: Int
  }
`

const resolvers = {
  Query: {
    allSubjects: () => subjects,
    subjectCount: () => subjects.length
  }
}

module.exports = {
  typeDefs,
  resolvers
}