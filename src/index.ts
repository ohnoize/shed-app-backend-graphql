/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import createSchema from './graphql/schema';
import User, { UserBaseDocument } from './models/user';

import config from './utils/config';
import { TokenUserType } from './types';

console.log('Connectingg to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const schema = createSchema();

export const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: TokenUserType = <any>jwt.verify(
        auth.substring(7), config.SECRET_KEY,
      );
      const currentUser: UserBaseDocument = await User.findOne({ _id: decodedToken.id });
      return { currentUser };
    }
    return {};
  },
});

server.listen({ port: process.env.PORT || config.PORT }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
});
