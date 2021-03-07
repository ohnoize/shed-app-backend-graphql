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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../models/user"));
const subject_1 = __importDefault(require("../../models/subject"));
const config_1 = __importDefault(require("../../utils/config"));
const typeDefs = apollo_server_1.gql `
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
        addUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(args.password, saltRounds);
            const user = new user_1.default({
                username: args.username,
                instrument: args.instrument,
                joined: new Date().toString(),
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
        login: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
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
            const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET_KEY);
            return { token, user };
        }),
        editUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        deleteUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return user_1.default.findByIdAndDelete(args.id); }),
        deleteUserByName: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return user_1.default.findOneAndDelete({ username: args.username }); }),
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
