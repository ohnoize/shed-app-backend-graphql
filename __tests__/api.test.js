import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { server } from '../src/index';

const mongoose = require('mongoose');

const { query, mutate } = createTestClient(server);

// const initialSubjects = [
//   {
//     name: 'testsubject1',
//     description: 'subject for testing',
//     id: '1'
//   },
//   {
//     name: 'testsubject2',
//     description: 'another subject for testing',
//     id: '2'
//   }
// ];

test('Query subjects', async () => {
  const GET_SUBJECTS = gql`
  query {
    allSubjects {
      id
      name
      description
    }
  }
`;

  const res = await query({
    query: GET_SUBJECTS
  });

  expect(res.data.allSubjects).toHaveLength(2);
});

test('Add subject', async () => {
  const ADD_SUBJECT = gql`
  mutation addSubject($name: String!, $description: String) {
    addSubject(name: $name, description: $description) {
      name
      description
      id
    }
  }
`;

  const res = await mutate({
    mutation: ADD_SUBJECT,
    variables: { name: 'testSubject', description: 'subject for testing' }
  });

  expect(res.data.addSubject.name).toEqual('testSubject');
});

afterAll(() => {
  mongoose.connection.close();
});
