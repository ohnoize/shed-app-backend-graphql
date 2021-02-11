/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import createSchema from './graphql/schema.js';
import User from './models/user.js';

import config from './utils/config.cjs';

console.log('Connectingg to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const schema = createSchema();

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), config.SECRET_KEY
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
    return {};
  }
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
});
