import { gql, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import config from '../../utils/config.cjs';

const typeDefs = gql`
  input subjectNotesInput {
    subjectID: String
    notes: String
  }
  extend type Mutation {
    addUser(username: String!, instrument: String, password: String!): User
    login(username: String!, password: String!): AuthPayload
    editUser(id: String!, subjectNotes: subjectNotesInput!): User
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
        throw new UserInputError('Incorrect username or password');
      }
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(userForToken, config.SECRET_KEY);

      return { token, user };
    },
    editUser: async (root, args) => {
      const user = await User.findOne({ _id: args.id });
      if (!user) return null;
      const newNote = {
        ...args.subjectNotes,
        date: new Date().toString()
      };
      if (!user.subjectNotes) {
        user.subjectNotes = newNote;
      } else {
        user.subjectNotes = user.subjectNotes.concat(newNote);
      }
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
      return user;
    },
    deleteUser: async (root, args) => User.findByIdAndDelete(args.id),
    deleteUserByName: async (root, args) => User.findOneAndDelete({ username: args.username })
  }
};

export default {
  typeDefs,
  resolvers
};
