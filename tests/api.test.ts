import { createTestClient } from 'apollo-server-testing';
import mongoose from 'mongoose';
import { server } from '../src/index';
import Session from '../src/models/session';
import Subject from '../src/models/subject';
import User, { UserBaseDocument } from '../src/models/user';
import {
  ADD_SUBJECT,
  GET_SUBJECTS,
  ADD_USER,
  ALL_USERS,
  GET_SESSIONS,
  ADD_SESSION,
  LOGIN,
} from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { query, mutate } = createTestClient(server as any);

describe('Adding subjects, users, and sessions, able to create user and login, random text here', () => {
  let user: UserBaseDocument;
  beforeEach(async () => {
    await Subject.deleteMany();
    await User.deleteMany();
    await Session.deleteMany();
    user = new User({
      username: 'testUser',
      passwordHash: 'asfasfasf',
      instrument: 'theremin',
      joined: new Date().toString(),
    });
    await user.save();
  });
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  test('Add subject', async () => {
    const mutateRes = await mutate({
      mutation: ADD_SUBJECT,
      variables: { name: 'testSubject', description: 'subject for testing', userID: user.id },
    });

    const queryRes = await query({
      query: GET_SUBJECTS,
    });

    expect(queryRes.data.allSubjects).toHaveLength(1);
    expect(mutateRes.data.addSubject.name).toEqual('testSubject');
  });

  test('Add user', async () => {
    const mutateRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'testPassword', instrument: 'accordion' },
    });

    const queryRes = await query({
      query: ALL_USERS,
    });

    // console.log(queryRes.data.allUsers[0].id);

    expect(mutateRes.data.addUser.username).toEqual('testUser2');
    expect(queryRes.data.allUsers).toHaveLength(2);
    expect(queryRes.data.allUsers[0].username).toEqual('testUser');
    expect(queryRes.data.allUsers[1].username).toEqual('testUser2');
    expect(queryRes.data.allUsers[0].instrument).toEqual('theremin');
    expect(queryRes.data.allUsers[1].instrument).toEqual('accordion');
  });
  test('Add a session', async () => {
    const usersRes = await query({
      query: ALL_USERS,
    });
    await mutate({
      mutation: ADD_SUBJECT,
      variables: { name: 'chords', description: 'chords for testing', userID: user.id },
    });
    await mutate({
      mutation: ADD_SUBJECT,
      variables: { name: 'scales', description: 'scales for testing', userID: user.id },
    });
    const mutateRes = await mutate({
      mutation: ADD_SESSION,
      variables: {
        totalLength: 1200,
        userID: usersRes.data.allUsers[0].id,
        notes: 'test session',
        individualSubjects: [
          {
            name: 'scales',
            length: 120,
          },
          {
            name: 'chords',
            length: 1500,
          },
        ],
      },
    });
    console.log(mutateRes);
    const queryRes = await query({
      query: GET_SESSIONS,
    });

    expect(queryRes.data.allSessions).toHaveLength(1);
  });
  test('Sign up and login', async () => {
    const signUpRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' },
    });
    const loginRes = await mutate({
      mutation: LOGIN,
      variables: { username: 'testUser2', password: 'secret' },
    });
    const usersRes = await query({
      query: ALL_USERS,
    });

    expect(signUpRes.data.addUser).toHaveProperty('id');
    expect(loginRes.data.login).toHaveProperty('token');
    expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
  });

  test('Sign up, login, and add session', async () => {
    const signUpRes = await mutate({
      mutation: ADD_USER,
      variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' },
    });
    const loginRes = await mutate({
      mutation: LOGIN,
      variables: { username: 'testUser2', password: 'secret' },
    });
    const usersRes = await query({
      query: ALL_USERS,
    });

    await mutate({
      mutation: ADD_SESSION,
      variables: {
        totalLength: 1200,
        userID: loginRes.data.login.user.id,
        notes: 'test session',
        individualSubjects: [
          {
            name: 'scales',
            length: 120,
          },
          {
            name: 'chords',
            length: 1500,
          },
        ],
      },
    });

    const sessionsRes = await query({
      query: GET_SESSIONS,
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
    expect(sessionsRes.data.allSessions[0]).toHaveProperty('individualSubjects');
    expect(sessionsRes.data.allSessions[0].notes).toEqual('test session');
  }, 30000);
});
