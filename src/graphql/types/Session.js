import { gql } from 'apollo-server';
import sessions from '../../../data/sessions.js';
// import subjects from '../../../data/subjects.js';
// import users from '../../../data/users.js';

const typeDefs = gql`
  type SessionSubject {
    name: String!
    length: Int!
  }
  type Session {
    id: ID!
    totalLength: Int
    individualSubjects: [SessionSubject]
    notes: String
    userID: ID!
  }
  extend type Query {
    allSessions: [Session]
    sessionCount: Int
    findSession(id: Int): Session
  }
`;

const resolvers = {
  Session: {
    // individualSubjects: (root) => {
    //   const subjectIDs = root.individualSubjects.map(s => s.id);
    //   // eslint-disable-next-line eqeqeq
    //   const subjectsArray = subjectIDs.map(s => subjects.filter(p => p.id == s));
    //   // console.log(subjectIDs);
    //   console.log(subjectsArray);
    //   return subjectsArray;
    // },
    // user: (root) => ({
    //   id: root.user.id,
    //   username: users.find(u => u.id === root.user.id).username,
    //   instrument: users.find(u => u.id === root.user.id).instrument
    // })
  },
  Query: {
    allSessions: () => sessions,
    sessionCount: () => sessions.length,
    findSession: (root, args) => sessions.find(s => s.id === args.id)
  }
};

export default {
  typeDefs,
  resolvers
};
