import { gql } from 'apollo-server';
import Session from '../../models/session.js';
// import users from '../../../data/users.js';
// import sessions from '../../../data/sessions.js';

const typeDefs = gql`
  input sessionSubjectInput {
    name: String
    length: Int
  } 
  
  input createSessionInput {
    totalLength: Int!
    notes: String
    individualSubjects: [sessionSubjectInput]
    userID: ID!
  }
  extend type Mutation {
    addSession(
      totalLength: Int!,
      notes: String,
      individualSubjects: [sessionSubjectInput],
      userID: ID!
    ): Session
  }
`;

const resolvers = {
  Mutation: {
    addSession: (root, args) => {
      const session = new Session({ ...args });
      return session.save();
    }
  }
};

export default {
  typeDefs,
  resolvers
};
