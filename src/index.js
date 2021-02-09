/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import createSchema from './graphql/schema.js';

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack1234@cluster0.soglv.mongodb.net/shed-app?retryWrites=true&w=majority';
// const SECRET_KEY = 'SECRET KEY INDEED';

console.log('Connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
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
  schema
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
});
