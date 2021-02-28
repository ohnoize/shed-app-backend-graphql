import { gql, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import config from '../../utils/config.cjs';

const typeDefs = gql`
  
  extend type Mutation {
    addUser(username: String!, instrument: String, password: String!): User
    login(username: String!, password: String!): AuthPayload
    deleteUser(id: String!): User
    deleteUserByName(username: String!): User
  }
`;

const resolvers = {
  Mutation: {
    addUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
      const user = new User({
        username: args.username,
        instrument: args.instrument,
        joined: new Date().toString(),
        passwordHash
      });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(`User ${user.username} already exists.`, {
          invalidArgs: args
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new UserInputError('wrong credentials');
      }
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(userForToken, config.SECRET_KEY);

      return { token, user };
    },
    deleteUser: async (root, args) => User.findByIdAndDelete(args.id),
    deleteUserByName: async (root, args) => User.findOneAndDelete({ username: args.username })
  }
};

export default {
  typeDefs,
  resolvers
};
