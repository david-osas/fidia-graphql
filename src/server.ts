import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, ExpressContext } from "apollo-server-express";
import app from "./app";
import { resolvers } from "./schema/resolvers";
import { typeDefs } from "./schema/typeDef";
import http from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  Config,
} from "apollo-server-core";
import { connectToDB } from "./loaders/database";

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  introspection: true,
  playground: true,
} as Config<ExpressContext>);

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  connectToDB();

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}

startServer();
