import { gql, UserInputError } from 'apollo-server';
import User from '../../models/user.js';

const typeDefs = gql`
  
  extend type Mutation {
    addUser(username: String!, instrument: String): User
  }
`;

const resolvers = {
  Mutation: {
    addUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
      return user;
    }
  }
};

export default {
  typeDefs,
  resolvers
};
