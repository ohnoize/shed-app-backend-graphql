import { gql, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

const JWT_SECRET = 'SECRETKEYHERE';

const typeDefs = gql`
  
  extend type Mutation {
    addUser(username: String!, instrument: String): User
    login(username: String!, password: String!): Token
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

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    }
  }
};

export default {
  typeDefs,
  resolvers
};
