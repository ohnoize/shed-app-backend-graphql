"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN = exports.GET_SESSIONS = exports.ADD_SESSION = exports.ALL_USERS = exports.ADD_USER = exports.GET_SUBJECTS = exports.ADD_SUBJECT = void 0;
const apollo_server_1 = require("apollo-server");
exports.ADD_SUBJECT = apollo_server_1.gql `
  mutation addSubject($name: String!, $description: String, $userID: String) {
    addSubject(name: $name, description: $description, userID: $userID) {
      name
      description
      id
    }
  }
`;
exports.GET_SUBJECTS = apollo_server_1.gql `
      query {
        allSubjects {
          id
          name
          description
        }
    }
`;
exports.ADD_USER = apollo_server_1.gql `
  mutation addUser($username: String!, $instrument: String, $password: String!) {
    addUser(username: $username, password: $password, instrument: $instrument) {
      id
      username
      instrument
    }
  }
`;
exports.ALL_USERS = apollo_server_1.gql `
      query {
        allUsers {
          id
          username
          instrument
          joined
        }
      }
    `;
exports.ADD_SESSION = apollo_server_1.gql `
      mutation addSession(
        $totalLength: Int!,
        $individualSubjects: [sessionSubjectInput!]!,
        $notes: String,
        $userID: String!,
      ) {
        addSession(
          userID: $userID
          totalLength: $totalLength
          notes: $notes
          individualSubjects: $individualSubjects
      ) {
        id
        date
        totalLength
        notes
        userID
        individualSubjects {
          name,
          length
        }
      }
    }
  `;
exports.GET_SESSIONS = apollo_server_1.gql `
      query {
        allSessions {
          id
          date
          totalLength
          notes
          userID
          individualSubjects {
            name,
            length
          }
        }
      }
    `;
exports.LOGIN = apollo_server_1.gql `
    mutation login($username: String!, $password: String!) {
      login(
        username: $username
        password: $password
      ) {
        token
        user {
          id
          instrument
          username
          joined
        }
      }
    }
  `;
