import { gql } from 'apollo-server';

export const ADD_SUBJECT = gql`
  mutation addSubject($name: String!, $description: String, $userID: String) {
    addSubject(name: $name, description: $description, userID: $userID) {
      name
      description
      id
    }
  }
`;
export const GET_SUBJECTS = gql`
      query {
        allSubjects {
          id
          name
          description
          timePracticed
        }
    }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $instrument: String, $password: String!) {
    addUser(username: $username, password: $password, instrument: $instrument) {
      id
      username
      instrument
    }
  }
`;

export const ALL_USERS = gql`
      query {
        allUsers {
          id
          username
          instrument
          joined
        }
      }
    `;

export const ADD_SESSION = gql`
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
export const GET_SESSIONS = gql`
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
export const LOGIN = gql`
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
