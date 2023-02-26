const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./Schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Start the Apollo Server
server.applyMiddleware({ app });

// Start the server
async function startServer() {
  await db.connect();
  await app.listen(PORT);
  console.log(` Now listening on localhost:${PORT}`);
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();
