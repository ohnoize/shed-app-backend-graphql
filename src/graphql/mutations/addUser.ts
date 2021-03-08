import { gql, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { UserBaseDocument } from '../../models/user';
import Subject from '../../models/subject';
import config from '../../utils/config';
// eslint-disable-next-line import/no-cycle
import { ResolverMap } from '../schema';
import {
  AddUserType,
  EditUserInput,
  LoginResponse,
  LoginType,
  DBUserType,
  MySubjectType,
} from '../../types';

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

interface Resolvers {
  Mutation: ResolverMap;
}

const resolvers: Resolvers = {
  Mutation: {
    addUser: async (_root: DBUserType, args: AddUserType): Promise<UserBaseDocument> => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
      const user = new User({
        username: args.username,
        instrument: args.instrument,
        joined: new Date().toString(),
        passwordHash,
      });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(`User ${user.username} already exists.`, {
          invalidArgs: args,
        });
      }
      return user;
    },
    login: async (_root: DBUserType, args: LoginType): Promise<LoginResponse> => {
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
      const token = jwt.sign(userForToken, config.SECRET_KEY, { expiresIn: '24h' });

      return { token, user };
    },
    editUser: async (_root: DBUserType, args: EditUserInput): Promise<UserBaseDocument> => {
      const user = await User.findOne({ _id: args.id });
      // console.log('args:', args);
      if (!user) return null;
      const newNote = {
        notes: args.subjectNotes.notes,
        date: new Date().toString(),
      };
      const subject = user.mySubjects.find((s) => s.subjectID === args.subjectNotes.subjectID);
      if (subject) {
        subject.subjectNotes = subject.subjectNotes.concat(newNote);
        user.mySubjects.map((s) => (s.subjectID === subject.subjectID ? subject : s));
      } else {
        const subjectToAdd = await Subject.findOne({ _id: args.subjectNotes.subjectID });
        const newSubject: MySubjectType = {
          subjectID: subjectToAdd.id,
          subjectName: subjectToAdd.name,
          timePracticed: 0,
          subjectNotes: [ newNote ],
        };
        user.mySubjects = [
          ...user.mySubjects,
          newSubject,
        ];
      }
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    deleteUser: async (_root, args) => User.findByIdAndDelete(args.id),
    deleteUserByName: async (_root, args) => User.findOneAndDelete({ username: args.username }),
  },
};

export default {
  typeDefs,
  resolvers,
};
