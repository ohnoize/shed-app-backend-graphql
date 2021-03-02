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
const apollo_server_testing_1 = require("apollo-server-testing");
const index_1 = require("../src/index");
const session_1 = __importDefault(require("../src/models/session"));
const subject_1 = __importDefault(require("../src/models/subject"));
const user_1 = __importDefault(require("../src/models/user"));
const utils_1 = require("./utils");
const mongoose = require('mongoose');
const { query, mutate } = apollo_server_testing_1.createTestClient(index_1.server);
describe('Adding subjects, users, and sessions, able to create user and login, random text here', () => {
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield subject_1.default.deleteMany();
        yield user_1.default.deleteMany();
        yield session_1.default.deleteMany();
        const user = new user_1.default({
            username: 'testUser',
            passwordHash: 'asfasfasf',
            instrument: 'theremin',
            joined: new Date().toString()
        });
        yield user.save();
        done();
    }));
    afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
        yield mongoose.disconnect();
        done();
    }));
    test('Add subject', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const mutateRes = yield mutate({
            mutation: utils_1.ADD_SUBJECT,
            variables: { name: 'testSubject', description: 'subject for testing' }
        });
        const queryRes = yield query({
            query: utils_1.GET_SUBJECTS
        });
        expect(queryRes.data.allSubjects).toHaveLength(1);
        expect(mutateRes.data.addSubject.name).toEqual('testSubject');
        done();
    }));
    test('Add user', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const mutateRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'testPassword', instrument: 'accordion' }
        });
        const queryRes = yield query({
            query: utils_1.ALL_USERS
        });
        // console.log(queryRes.data.allUsers[0].id);
        expect(mutateRes.data.addUser.username).toEqual('testUser2');
        expect(queryRes.data.allUsers).toHaveLength(2);
        expect(queryRes.data.allUsers[0].username).toEqual('testUser');
        expect(queryRes.data.allUsers[1].username).toEqual('testUser2');
        expect(queryRes.data.allUsers[0].instrument).toEqual('theremin');
        expect(queryRes.data.allUsers[1].instrument).toEqual('accordion');
        done();
    }));
    test('Add a session', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const userRes = yield query({
            query: utils_1.ALL_USERS
        });
        yield mutate({
            mutation: utils_1.ADD_SESSION,
            variables: {
                totalLength: 1200,
                userID: userRes.data.allUsers[0].id,
                notes: 'test session',
                date: '12.12.2012',
                individualSubjects: [
                    {
                        name: 'scales',
                        length: 120
                    },
                    {
                        name: 'chords',
                        length: 1500
                    }
                ]
            }
        });
        const queryRes = yield query({
            query: utils_1.GET_SESSIONS
        });
        expect(queryRes.data.allSessions).toHaveLength(1);
        done();
    }));
    test('Sign up and login', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' }
        });
        const loginRes = yield mutate({
            mutation: utils_1.LOGIN,
            variables: { username: 'testUser2', password: 'secret' }
        });
        const usersRes = yield query({
            query: utils_1.ALL_USERS
        });
        expect(signUpRes.data.addUser).toHaveProperty('id');
        expect(loginRes.data.login).toHaveProperty('token');
        expect(usersRes.data.allUsers[1].username).toEqual('testUser2');
        done();
    }));
    test('Sign up, login, and add session', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpRes = yield mutate({
            mutation: utils_1.ADD_USER,
            variables: { username: 'testUser2', password: 'secret', instrument: 'balalaika' }
        });
        const loginRes = yield mutate({
            mutation: utils_1.LOGIN,
            variables: { username: 'testUser2', password: 'secret' }
        });
        const usersRes = yield query({
            query: utils_1.ALL_USERS
        });
        yield mutate({
            mutation: utils_1.ADD_SESSION,
            variables: {
                totalLength: 1200,
                userID: loginRes.data.login.user.id,
                notes: 'test session',
                date: '12.12.2012',
                individualSubjects: [
                    {
                        name: 'scales',
                        length: 120
                    },
                    {
                        name: 'chords',
                        length: 1500
                    }
                ]
            }
        });
        const sessionsRes = yield query({
            query: utils_1.GET_SESSIONS
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
        expect(sessionsRes.data.allSessions[0].date).toEqual('12.12.2012');
        expect(sessionsRes.data.allSessions[0]).toHaveProperty('individualSubjects');
        expect(sessionsRes.data.allSessions[0].notes).toEqual('test session');
        done();
    }), 30000);
});
