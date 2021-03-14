"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../models/user"));
const subject_1 = __importDefault(require("../../models/subject"));
const auth_1 = require("../../auth");
const sendRefreshToken_1 = require("../../sendRefreshToken");
const typeDefs = apollo_server_1.gql `
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
const resolvers = {
    Mutation: {
        addUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(args.password, saltRounds);
            const user = new user_1.default({
                username: args.username,
                instrument: args.instrument,
                joined: new Date().toString(),
                timePracticed: 0,
                passwordHash,
            });
            try {
                yield user.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(`User ${user.username} already exists.`, {
                    invalidArgs: args,
                });
            }
            return user;
        }),
        login: (_root, args, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ username: args.username });
            const passwordCorrect = user === null
                ? false
                : yield bcrypt_1.default.compare(args.password, user.passwordHash);
            if (!(user && passwordCorrect)) {
                throw new apollo_server_1.UserInputError('Incorrect username or password');
            }
            const userForToken = {
                username: user.username,
                id: user.id,
            };
            if (!(process.env.NODE_ENV === 'test')) {
                const userForRefreshToken = {
                    id: user.id,
                };
                sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(userForRefreshToken));
            }
            const token = auth_1.createNewToken(userForToken);
            return { token, user };
        }),
        editUser: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                throw new apollo_server_1.AuthenticationError('You have to be signed in to add subjects!');
            }
            const user = yield user_1.default.findOne({ _id: args.id });
            // console.log('args:', args);
            if (!user)
                return null;
            const newNote = {
                notes: args.subjectNotes.notes,
                date: new Date().toString(),
            };
            const subject = user.mySubjects.find((s) => s.subjectID === args.subjectNotes.subjectID);
            if (subject) {
                subject.subjectNotes = subject.subjectNotes.concat(newNote);
                user.mySubjects.map((s) => (s.subjectID === subject.subjectID ? subject : s));
            }
            else {
                const subjectToAdd = yield subject_1.default.findOne({ _id: args.subjectNotes.subjectID });
                const newSubject = {
                    subjectID: subjectToAdd.id,
                    subjectName: subjectToAdd.name,
                    timePracticed: 0,
                    subjectNotes: [newNote],
                };
                user.mySubjects = [
                    ...user.mySubjects,
                    newSubject,
                ];
            }
            try {
                yield user.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return user;
        }),
        addGoal: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                throw new apollo_server_1.AuthenticationError('You have to be signed in to add subjects!');
            }
            const user = yield user_1.default.findOne({ _id: args.id });
            if (!user)
                return null;
            const newGoal = Object.assign(Object.assign({}, args.goal), { elapsedTime: 0, passed: false });
            user.goals = [
                ...user.goals,
                newGoal,
            ];
            try {
                yield user.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return user;
        }),
        editGoal: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ _id: args.userID });
            if (!user)
                return null;
            const goalToEdit = user.goals.find((g) => g.id === args.goalID);
            if (!goalToEdit)
                return null;
            goalToEdit.elapsedTime += args.time;
            if (goalToEdit.elapsedTime >= goalToEdit.targetTime) {
                goalToEdit.passed = true;
            }
            user.goals = user.goals.map((g) => (g.id !== args.goalID ? g : goalToEdit));
            try {
                yield user.save();
            }
            catch (e) {
                throw new apollo_server_1.UserInputError(e.message, {
                    invalidArgs: args,
                });
            }
            return goalToEdit;
        }),
        deleteGoal: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ _id: args.userID });
            if (!user)
                return null;
            const goalToDelete = user.goals.find((g) => g.id === args.goalID);
            if (!goalToDelete)
                return null;
            user.goals = user.goals.filter((g) => g.id !== args.goalID);
            try {
                yield user.save();
            }
            catch (e) {
                throw new apollo_server_1.UserInputError(e.message, {
                    invalidArgs: args,
                });
            }
            return user;
        }),
        deleteUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return user_1.default.findByIdAndDelete(args.id); }),
        deleteUserByName: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return user_1.default.findOneAndDelete({ username: args.username }); }),
        logOut: (_root, _args, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            sendRefreshToken_1.sendRefreshToken(res, '');
            return true;
        }),
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
