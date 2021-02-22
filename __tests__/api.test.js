import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { server } from '../src/index';
import Session from '../src/models/session';
import Subject from '../src/models/subject.js';
import User from '../src/models/user';

const mongoose = require('mongoose');

const { query, mutate } = createTestClient(server);

const ADD_SUBJECT = gql`
  mutation addSubject($name: String!, $description: String) {
    addSubject(name: $name, description: $description) {
      name
      description
      id
    }
  }
`;
const GET_SUBJECTS = gql`
      query {
        allSubjects {
          id
          name
          description
        }
    }
`;

const ADD_USER = gql`
  mutation addUser($username: String!, $instrument: String, $password: String!) {
    addUser(username: $username, password: $password, instrument: $instrument) {
      id
      username
      instrument
    }
  }
`;

const ALL_USERS = gql`
      query {
        allUsers {
          id
          username
          instrument
          joined
        }
      }
    `;

const ADD_SESSION = gql`
      mutation addSession(
        $totalLength: Int!,
        $individualSubjects: [sessionSubjectInput!]!,
        $notes: String,
        $date: String!
        $userID: String!,
      ) {
        addSession(
          userID: $userID
          totalLength: $totalLength
          notes: $notes
          individualSubjects: $individualSubjects
          date: $date
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
const GET_SESSIONS = gql`
      query allSessions($userID:String){
        allSessions(userID: $userID) {
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

describe('Adding subjects, users, and sessions', () => {
  beforeEach(async (done) => {
    await Subject.deleteMany();
    await User.deleteMany();
    await Session.deleteMany();
    const user = new User({
      username: 'testUser',
      passwordHash: 'asfasfasf',
      instrument: 'theremin',
      joined: new Date().toString()
    });
    await user.save();
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    done();
  });

  test('Add subject', async (done) => {
    const mutateRes = await mutate({
      mutation: ADD_SUBJECT,
      variables: { name: 'testSubject', description: 'subject for testing' }
    });

    const queryRes = await query({
      query: GET_SUBJECTS
    });

    expect(queryRes.data.allSubjects).toHaveLength(1);
    expect(mutateRes.data.addSubject.name).toEqual('testSubject');
    done();
  });

  test('Add user', async (done) => {
    const mutateRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'testPassword', instrument: 'accordion' }
    });

    const queryRes = await query({
      query: ALL_USERS
    });

    // console.log(queryRes.data.allUsers[0].id);

    expect(mutateRes.data.addUser.username).toEqual('testUser2');
    expect(queryRes.data.allUsers).toHaveLength(2);
    expect(queryRes.data.allUsers[0].username).toEqual('testUser');
    expect(queryRes.data.allUsers[1].username).toEqual('testUser2');
    expect(queryRes.data.allUsers[0].instrument).toEqual('theremin');
    expect(queryRes.data.allUsers[1].instrument).toEqual('accordion');
    done();
  });
  test('Add a session', async (done) => {
    const userRes = await query({
      query: ALL_USERS
    });

    await mutate({
      mutation: ADD_SESSION,
      variables: {
        totalLength: 1200,
        userID: userRes.data.allUsers[0].id,
        notes: 'test session',
        date: '12.12.2012',
        individualSubjects: [
          {
            name: 'scales',
            length: 120
          },
          {
            name: 'chords',
            length: 1500
          }
        ]
      }
    });

    const queryRes = await query({
      query: GET_SESSIONS
    });

    expect(queryRes.data.allSessions).toHaveLength(1);
    done();
  });
});
