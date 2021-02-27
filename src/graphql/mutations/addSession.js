import { gql, UserInputError } from 'apollo-server';
import Session from '../../models/session.js';
import User from '../../models/user.js';
// import users from '../../../data/users.js';
// import sessions from '../../../data/sessions.js';

const typeDefs = gql`
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
      date: String!
      totalLength: Int!,
      notes: String,
      individualSubjects: [sessionSubjectInput],
      userID: String!
    ): Session
    deleteSession(id: String!):Session
  }
`;

const resolvers = {
  Mutation: {
    addSession: async (root, args) => {
      // console.log(args.userID);
      const user = await User.findOne({ _id: args.userID });
      // console.log(user);
      const session = new Session({ ...args, user: user.id });
      // console.log(session);
      try {
        await session.save();
        user.sessions = user.sessions.concat(session.id);
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
      return session;
    },
    deleteSession: async (root, args) => Session.findByIdAndDelete(args.id)
  }
};

export default {
  typeDefs,
  resolvers
};
