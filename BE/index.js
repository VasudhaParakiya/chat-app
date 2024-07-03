import { ApolloServer, ApolloError } from "apollo-server-express";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import dbConnection from "./db/db";

import typeDefs from "./graphql/typedefs/index.js";
import resolvers from "./graphql/resolver/index.js";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use(cors());

async function startServer() {
  const apolloServer = new ApolloServer({
    schema,

    context: async ({ req }) => {
      const token = req?.headers?.authorization || "";
      // console.log("🚀 ~ startServer ~ token:", token);
      if (!token) return new Error("Not authenticated");

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("🚀 ~ startServer ~ user:", user);
        return { user };
      } catch (error) {
        console.log("JWT Error:", error.message);
        throw new ApolloError("Invalid or expired token", "UNAUTHENTICATED");
      }
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema }, wsServer);

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
  });
}

startServer();
dbConnection();
