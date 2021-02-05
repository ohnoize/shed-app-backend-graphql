import { ApolloServer } from 'apollo-server';
import createSchema from './graphql/schema.js';

const schema = createSchema();

const server = new ApolloServer({
  schema
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
});
