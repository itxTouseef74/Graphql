const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');
const { typeDefs } = require('./graphql/graphQLSchema');
const { resolvers } = require('./graphql/resolver.js');

async function startServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });

  await server.start();
  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: server.graphqlPath,
  });

  useServer({ schema }, wsServer);

  mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });
}

startServer();
