import { gql } from 'apollo-server';
import User from '../../models/user.js';

const typeDefs = gql`
  
  extend type Mutation {
    addUser(username: String!, instrument: String): User
  }
`;

const resolvers = {
  Mutation: {
    addUser: (root, args) => {
      const user = new User({ ...args });
      return user.save();
    }
  }
};

export default {
  typeDefs,
  resolvers
};
