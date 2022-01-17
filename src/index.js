import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

//subscription
const pubsub = new PubSub();

const server = new GraphQLServer({
  //schema
  typeDefs: "./src/schema.graphql",
  //resolver
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  //db connect
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("The server is up!");
});
