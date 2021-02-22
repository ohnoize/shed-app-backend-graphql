import { createTestClient } from 'apollo-server-testing';
import { server } from '../src/index';
import Session from '../src/models/session';
import Subject from '../src/models/subject.js';
import User from '../src/models/user';
import {
  ADD_SUBJECT,
  GET_SUBJECTS,
  ADD_USER,
  ALL_USERS,
  GET_SESSIONS,
  ADD_SESSION,
  LOGIN
} from './utils.js';

const mongoose = require('mongoose');

const { query, mutate } = createTestClient(server);

describe('Adding subjects, users, and sessions, able to create user and login, random text here', () => {
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
  test('Sign up and login', async (done) => {
    const signUpRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' }
    });
    const loginRes = await mutate({
      mutation: LOGIN,
      variables: { username: 'testUser2', password: 'secret' }
    });
    const usersRes = await query({
      query: ALL_USERS
    });

    expect(signUpRes.data.addUser).toHaveProperty('id');
    expect(loginRes.data.login).toHaveProperty('token');
    expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
    done();
  });

  test('Sign up, login, and add session', async (done) => {
    const signUpRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' }
    });
    const loginRes = await mutate({
      mutation: LOGIN,
      variables: { username: 'testUser2', password: 'secret' }
    });
    const usersRes = await query({
      query: ALL_USERS
    });

    await mutate({
      mutation: ADD_SESSION,
      variables: {
        totalLength: 1200,
        userID: loginRes.data.login.user.id,
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

    const sessionsRes = await query({
      query: GET_SESSIONS
    });

    const userID = loginRes.data.login.user.id;

    expect(signUpRes.data.addUser).toHaveProperty('id');
    expect(loginRes.data.login).toHaveProperty('token');
    expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
    expect(sessionsRes.data.allSessions).toHaveLength(1);
    expect(sessionsRes.data.allSessions[0]).toHaveProperty('totalLength');
    expect(sessionsRes.data.allSessions[0].totalLength).toEqual(1200);
    expect(sessionsRes.data.allSessions[0]).toHaveProperty('userID');
    expect(sessionsRes.data.allSessions[0].userID).toEqual(userID);
    expect(sessionsRes.data.allSessions[0]).toHaveProperty('date');
    expect(sessionsRes.data.allSessions[0].date).toEqual('12.12.2012');
    expect(sessionsRes.data.allSessions[0]).toHaveProperty('individualSubjects');
    expect(sessionsRes.data.allSessions[0].notes).toEqual('test session');
    done();
  }, 30000);
});
