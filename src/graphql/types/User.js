import { gql } from 'apollo-server';
import users from '../../../data/users.js';

const typeDefs = gql`
  type User {
    id: ID!
    username: String
    instrument: String
  }
  extend type Query {
    allUsers: [User]
    userCount: Int
    findUser(id: Int): User
  }
`;
const resolvers = {
  Query: {
    allUsers: () => users,
    userCount: () => users.length,
    findUser: (root, args) => users.find(u => u.id === args.id)
  }
};

export default {
  typeDefs,
  resolvers
};
