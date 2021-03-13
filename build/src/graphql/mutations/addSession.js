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
const session_1 = __importDefault(require("../../models/session"));
const subject_1 = __importDefault(require("../../models/subject"));
const user_1 = __importDefault(require("../../models/user"));
const typeDefs = apollo_server_1.gql `
  input sessionSubjectInput {
    name: String
    length: Int
  } 
  
  input createSessionInput {
    totalLength: Int!
    notes: String
    individualSubjects: [sessionSubjectInput]
    userID: String!
  }
  extend type Mutation {
    addSession(
      totalLength: Int!,
      notes: String,
      individualSubjects: [sessionSubjectInput],
      userID: String!
    ): Session
    deleteSession(id: String!): Session
    deleteSessionByNotes(notes: String!): Session
  }
`;
const resolvers = {
    Mutation: {
        // eslint-disable-next-line max-len
        addSession: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated!');
            }
            const user = yield user_1.default.findOne({ _id: args.userID });
            const session = new session_1.default(Object.assign(Object.assign({}, args), { user: user.id }));
            session.date = new Date().toString();
            user.sessions = user.sessions.concat(session.id);
            user.timePracticed += session.totalLength;
            try {
                yield session.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            yield Promise.all(session.individualSubjects.map((i) => __awaiter(void 0, void 0, void 0, function* () {
                const dbSubject = yield subject_1.default.findOne({ name: i.name });
                dbSubject.timePracticed += i.length;
                try {
                    yield dbSubject.save();
                }
                catch (e) {
                    throw new apollo_server_1.UserInputError(e.message, {
                        invalidArgs: args,
                    });
                }
                const goal = user.goals.find((g) => g.subject === i.name);
                if (goal) {
                    goal.elapsedTime += i.length;
                }
                const subject = user.mySubjects.find((s) => s.subjectName === i.name);
                if (subject) {
                    subject.timePracticed += i.length;
                    user.mySubjects.map((s) => (s.subjectName !== subject.subjectName ? s : subject));
                }
                else {
                    const newSubject = {
                        subjectID: dbSubject.id,
                        subjectName: i.name,
                        timePracticed: i.length,
                        subjectNotes: [],
                    };
                    user.mySubjects = [
                        ...user.mySubjects,
                        newSubject,
                    ];
                }
            })));
            try {
                yield user.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return session;
        }),
        deleteSession: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return session_1.default.findByIdAndDelete(args.id); }),
        deleteSessionByNotes: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return session_1.default.findOneAndDelete({ notes: args.notes }); }),
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
