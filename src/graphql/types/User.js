import { gql } from 'apollo-server';
import User from '../../models/user.js';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
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
    allUsers: () => User.find({}),
    userCount: () => User.collection.countDocuments(),
    findUser: (root, args) => User.findOne({ id: args.id })
  }
};

export default {
  typeDefs,
  resolvers
};
