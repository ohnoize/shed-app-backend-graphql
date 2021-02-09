import { gql } from 'apollo-server';
import User from '../../models/user.js';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    instrument: String
  }
  type Token {
    value: String!
  }
  extend type Query {
    allUsers: [User]
    userCount: Int
    findUser(id: Int): User
    me: User
  }
`;
const resolvers = {
  Query: {
    allUsers: () => User.find({}),
    userCount: () => User.collection.countDocuments(),
    findUser: (root, args) => User.findOne({ id: args.id }),
    me: (root, args, context) => context.currentUser
  }
};

export default {
  typeDefs,
  resolvers
};
