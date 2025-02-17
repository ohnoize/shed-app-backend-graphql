import { AuthenticationError, gql, UserInputError } from 'apollo-server';
import bcrypt from 'bcrypt';
import User, { UserBaseDocument } from '../../models/user';
import Subject from '../../models/subject';
// eslint-disable-next-line import/no-cycle
import { Context, ResolverMap } from '../schema';
import {
  AddUserType,
  EditUserInput,
  LoginResponse,
  LoginType,
  DBUserType,
  MySubjectType,
  AddGoalType,
  DeleteGoalType,
  EditGoalType,
  DBGoalType,
} from '../../types';
import { createNewToken, createRefreshToken } from '../../auth';
import { sendRefreshToken } from '../../sendRefreshToken';

const typeDefs = gql`
  input subjectNotesInput {
    subjectID: String
    notes: String
  }
  input goalInput {
    description: String!,
    subject: String!,
    targetTime: Int!,
    deadline: String,
  }
  extend type Mutation {
    addUser(username: String!, instrument: String, password: String!): User
    login(username: String!, password: String!): AuthPayload
    editUser(id: String!, subjectNotes: subjectNotesInput!): User
    addGoal(id: String!, goal: goalInput!): User
    editGoal(userID: String!, goalID: String!, time: Int!): Goal
    deleteGoal(userID: String!, goalID: String!): User
    deleteUser(id: String!): User
    deleteUserByName(username: String!): User
    logOut: Boolean!
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
        joined: new Date().toISOString(),
        timePracticed: 0,
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
    login: async (_root: DBUserType, args: LoginType, { res }: Context): Promise<LoginResponse> => {
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

      if (!(process.env.NODE_ENV === 'test')) {
        const userForRefreshToken = {
          id: user.id,
        };
        sendRefreshToken(res, createRefreshToken(userForRefreshToken));
      }
      const token = createNewToken(userForToken);

      return { token, user };
    },
    editUser: async (
      _root: DBUserType,
      args: EditUserInput,
      context: Context,
    ): Promise<UserBaseDocument> => {
      if (!context.currentUser) {
        throw new AuthenticationError('You have to be signed in to add subjects!');
      }
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
    addGoal: async (
      _root: DBUserType,
      args: AddGoalType,
      context: Context,
    ): Promise<UserBaseDocument> => {
      if (!context.currentUser) {
        throw new AuthenticationError('You have to be signed in to add subjects!');
      }
      const user = await User.findOne({ _id: args.id });
      if (!user) return null;
      const newGoal = {
        ...args.goal,
        elapsedTime: 0,
        passed: false,
      };
      user.goals = [
        ...user.goals,
        newGoal,
      ];
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    editGoal: async (_root: DBUserType, args: EditGoalType): Promise<DBGoalType> => {
      const user = await User.findOne({ _id: args.userID });
      if (!user) return null;
      const goalToEdit = user.goals.find((g) => g.id === args.goalID);
      if (!goalToEdit) return null;
      goalToEdit.elapsedTime += args.time;
      if (goalToEdit.elapsedTime >= goalToEdit.targetTime) {
        goalToEdit.passed = true;
      }
      user.goals = user.goals.map((g) => (g.id !== args.goalID ? g : goalToEdit));
      try {
        await user.save();
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args,
        });
      }
      return goalToEdit;
    },
    deleteGoal: async (_root: DBUserType, args: DeleteGoalType): Promise<UserBaseDocument> => {
      const user = await User.findOne({ _id: args.userID });
      if (!user) return null;
      const goalToDelete = user.goals.find((g) => g.id === args.goalID);
      if (!goalToDelete) return null;
      user.goals = user.goals.filter((g) => g.id !== args.goalID);
      try {
        await user.save();
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    deleteUser: async (_root, args) => User.findByIdAndDelete(args.id),
    deleteUserByName: async (_root, args) => User.findOneAndDelete({ username: args.username }),
    logOut: async (_root: DBUserType, _args: void, { res }: Context): Promise<boolean> => {
      sendRefreshToken(res, '');
      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
