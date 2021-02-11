import { gql, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import config from '../../utils/config.cjs';

const typeDefs = gql`
  
  extend type Mutation {
    addUser(username: String!, instrument: String): User
    login(username: String!, password: String!): AuthPayload
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
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(userForToken, config.SECRET_KEY);

      return { token, user };
    }
  }
};

export default {
  typeDefs,
  resolvers
};
