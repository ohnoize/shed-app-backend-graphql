import { gql } from 'apollo-server';
import sessions from '../../../data/sessions.js';
import subjects from '../../../data/subjects.js';
import users from '../../../data/users.js';

const typeDefs = gql`
  type SessionSubject {
    id: ID!
    length: Int
  }
  type Session {
    id: ID!
    totalLength: Int
    individualSubjects: [SessionSubject]
    notes: String
    user: User
  }
  extend type Query {
    allSessions: [Session]
    sessionCount: Int
    findSession(id: Int): Session
  }
`;

const resolvers = {
  Session: {
    individualSubjects: (root) => {
      const subjectIDs = root.individualSubjects.map(s => s.id);
      const subjectsArray = subjectIDs.map(s => subjects.filter(p => p.id === s));
      // console.log(subjectsArray);
      return {
        id: subjectsArray.id,
        name: subjectsArray.name,
        description: subjectsArray.description
      };
    },
    user: (root) => ({
      id: root.user.id,
      username: users.find(u => u.id === root.user.id).username,
      instrument: users.find(u => u.id === root.user.id).instrument
    })
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
