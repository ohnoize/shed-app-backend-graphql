import { gql } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
// import users from '../../../data/users.js';
// import sessions from '../../../data/sessions.js';

const typeDefs = gql`
  input sessionSubjectInput {
    id: ID
    length: Int
  } 
  
  input createSessionInput {
    totalLength: Int!
    notes: String
    individualSubjects: [sessionSubjectInput]
    userID: ID!
  }
  extend type Mutation {
    addSession(session: createSessionInput): Session
  }
`;

const resolvers = {
  Mutation: {
    addSession: (root, args) => {
      const session = { ...args.session, id: uuidv4() };
      console.log(session);
      return session;
    }
  }
};

export default {
  typeDefs,
  resolvers
};
