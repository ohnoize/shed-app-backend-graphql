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
const apollo_server_testing_1 = require("apollo-server-testing");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../src/index");
const session_1 = __importDefault(require("../src/models/session"));
const subject_1 = __importDefault(require("../src/models/subject"));
const user_1 = __importDefault(require("../src/models/user"));
const utils_1 = require("./utils");
const testServer = new apollo_server_1.ApolloServer({
    schema: index_1.schema,
    introspection: true,
    playground: true,
    context: () => {
        const currentUser = new user_1.default({
            username: 'contextUser',
            passwordHash: 'contextHash',
            instrument: 'context',
            joined: new Date().toString(),
        });
        return { currentUser };
    },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { query, mutate } = apollo_server_testing_1.createTestClient(testServer);
describe('Adding subjects, users, and sessions, able to create user and login, random text here', () => {
    let user;
    let subject1;
    let subject2;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield subject_1.default.deleteMany();
        yield user_1.default.deleteMany();
        yield session_1.default.deleteMany();
        user = new user_1.default({
            username: 'testUser',
            passwordHash: 'asfasfasf',
            instrument: 'theremin',
            joined: new Date().toString(),
        });
        yield user.save();
        subject1 = new subject_1.default({
            name: 'chords',
            description: 'chords for testing',
            userID: user.id,
            timePracticed: 0,
        });
        subject2 = new subject_1.default({
            name: 'scales',
            description: 'scales for testing',
            userID: user.id,
            timePracticed: 0,
        });
        yield subject1.save();
        yield subject2.save();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        yield mongoose_1.default.disconnect();
    }));
    test('Add subject', () => __awaiter(void 0, void 0, void 0, function* () {
        const mutateRes = yield mutate({
            mutation: utils_1.ADD_SUBJECT,
            // eslint-disable-next-line no-underscore-dangle
            variables: { name: 'testSubject', description: 'subject for testing', userID: user.id },
        });
        const queryRes = yield query({
            query: utils_1.GET_SUBJECTS,
        });
        expect(queryRes.data.allSubjects).toHaveLength(3);
        expect(mutateRes.data.addSubject.name).toEqual('testSubject');
    }));
    test('Add user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mutateRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'testPassword', instrument: 'accordion' },
        });
        const queryRes = yield query({
            query: utils_1.ALL_USERS,
        });
        // console.log(queryRes.data.allUsers[0].id);
        expect(mutateRes.data.addUser.username).toEqual('testUser2');
        expect(queryRes.data.allUsers).toHaveLength(2);
        expect(queryRes.data.allUsers[0].username).toEqual('testUser');
        expect(queryRes.data.allUsers[1].username).toEqual('testUser2');
        expect(queryRes.data.allUsers[0].instrument).toEqual('theremin');
        expect(queryRes.data.allUsers[1].instrument).toEqual('accordion');
    }));
    test('Add a session', () => __awaiter(void 0, void 0, void 0, function* () {
        const usersRes = yield query({
            query: utils_1.ALL_USERS,
        });
        // await mutate({
        //   mutation: ADD_SUBJECT,
        //   variables: { name: 'chords', description: 'chords for testing', userID: user.id },
        // });
        // await mutate({
        //   mutation: ADD_SUBJECT,
        //   variables: { name: 'scales', description: 'scales for testing', userID: user.id },
        // });
        yield mutate({
            mutation: utils_1.ADD_SESSION,
            variables: {
                totalLength: 1200,
                userID: usersRes.data.allUsers[0].id,
                notes: 'test session',
                individualSubjects: [
                    {
                        name: 'scales',
                        length: 120,
                    },
                    {
                        name: 'chords',
                        length: 1500,
                    },
                ],
            },
        });
        const queryRes = yield query({
            query: utils_1.GET_SESSIONS,
        });
        expect(queryRes.data.allSessions).toHaveLength(1);
    }));
    test('Sign up and login', () => __awaiter(void 0, void 0, void 0, function* () {
        const signUpRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' },
        });
        // console.log(signUpRes.data.addUser);
        const loginRes = yield mutate({
            mutation: utils_1.LOGIN,
            variables: { username: 'testUser2', password: 'secret' },
        });
        const usersRes = yield query({
            query: utils_1.ALL_USERS,
        });
        expect(signUpRes.data.addUser).toHaveProperty('id');
        expect(loginRes.data.login).toHaveProperty('token');
        expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
    }));
    test('Sign up, login, and add session', () => __awaiter(void 0, void 0, void 0, function* () {
        const signUpRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' },
        });
        const loginRes = yield mutate({
            mutation: utils_1.LOGIN,
            variables: { username: 'testUser2', password: 'secret' },
        });
        const usersRes = yield query({
            query: utils_1.ALL_USERS,
        });
        yield mutate({
            mutation: utils_1.ADD_SESSION,
            variables: {
                totalLength: 1200,
                userID: loginRes.data.login.user.id,
                notes: 'test session',
                individualSubjects: [
                    {
                        name: 'scales',
                        length: 120,
                    },
                    {
                        name: 'chords',
                        length: 1500,
                    },
                ],
            },
        });
        const sessionsRes = yield query({
            query: utils_1.GET_SESSIONS,
        });
        const userID = loginRes.data.login.user.id;
        expect(signUpRes.data.addUser).toHaveProperty('id');
        expect(loginRes.data.login).toHaveProperty('token');
        expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
        expect(sessionsRes.data.allSessions).toHaveLength(1);
        expect(sessionsRes.data.allSessions[0]).toHaveProperty('totalLength');
        expect(sessionsRes.data.allSessions[0].totalLength).toEqual(1200);
        expect(sessionsRes.data.allSessions[0]).toHaveProperty('userID');
        expect(sessionsRes.data.allSessions[0].userID).toEqual(userID);
        expect(sessionsRes.data.allSessions[0]).toHaveProperty('date');
        expect(sessionsRes.data.allSessions[0]).toHaveProperty('individualSubjects');
        expect(sessionsRes.data.allSessions[0].notes).toEqual('test session');
    }), 30000);
});
