import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

const server = new GraphQLServer({
  //schema
  typeDefs: "./src/schema.graphql",
  //resolver
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
  //db connect
  context: {
    db,
  },
});

server.start(() => {
  console.log("The server is up!");
});
