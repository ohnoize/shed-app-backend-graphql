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
const subject_1 = __importDefault(require("../../models/subject"));
const user_1 = __importDefault(require("../../models/user"));
const typeDefs = apollo_server_1.gql `
  
  extend type Mutation {
    addSubject(name: String!, description: String, userID: String): Subject
    deleteSubject(name: String!): Subject
  }
`;
const resolvers = {
    Mutation: {
        // eslint-disable-next-line max-len
        addSubject: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const subject = new subject_1.default(Object.assign({}, args));
            subject.timePracticed = 0;
            const user = yield user_1.default.findOne({ _id: args.userID });
            const userSubject = {
                subjectID: subject.id,
                subjectName: subject.name,
                timePracticed: 0,
                subjectNotes: [],
            };
            user.mySubjects = [
                ...user.mySubjects,
                userSubject,
            ];
            // console.log(user);
            try {
                yield subject.save();
                yield user.save();
            }
            catch (error) {
                throw new apollo_server_1.UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return subject;
        }),
        deleteSubject: (_root, args) => __awaiter(void 0, void 0, void 0, function* () { return subject_1.default.findOneAndDelete({ name: args.name }); }),
    },
};
exports.default = {
    typeDefs,
    resolvers,
};
