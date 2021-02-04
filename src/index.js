const { ApolloServer, gql } = require('apollo-server');
const schema = require('./graphql/schema');


const server = new ApolloServer({
  schema
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
