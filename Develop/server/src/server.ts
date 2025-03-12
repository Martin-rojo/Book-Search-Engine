import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { authMiddleware } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,

});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// Use the REST API routes alongside GraphQL (optional - you can remove this if you want to fully migrate to GraphQL)
app.use(routes);

// Create a function to start the server
const startServer = async () => {
  // Start the Apollo server
  await server.start();
  
  // Apply the Apollo GraphQL middleware to the Express server
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware as any
  }));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startServer();