import { GraphQLServer } from "graphql-yoga";

//user data
const users = [
  {
    id: "1",
    name: "Andrew",
    email: "anderson@gmail.com",
    age: 27,
  },
  {
    id: "2",
    name: "sarah",
    email: "anderson@gmail.com",
    age: 23,
  },
  {
    id: "3",
    name: "mike",
    email: "mike@gmail.com",
    age: 22,
  },
];

//type definition (schema)
/* greeting(name: String): String!
    add(a: Float!, b:Float!): String!
    grades:[Int!]! */

const typeDefs = `
  type Query {
    users(query: String):[User!]!
    me: User!
    post: Post!
    addToArray(numbers:[Float!]!): Float!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;
// Resolvers
const resolvers = {
  Query: {
    users(parent, args, context, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    addToArray(parent, args, context, info) {
      if (args.numbers.length === 0) {
        return 0;
      }
      return args.numbers.reduce((accumulateur, currentValue) => {
        return accumulateur + currentValue;
      });
    },
    /* 
    greeting: (_, { name }) => `Hello ${name || "World"}`,
    add: (_, { a, b }) => `My result is ${a + b || "null"}`,
    grades: () => [99, 80, 100], 
    me() {
      return {
        id: "1233365",
        name: "Mike",
        email: "Mike@gmail.com",
        age: 20,
      };
    },
    post() {
      return {
        id: "1Lma12235",
        title: "My first Post",
        body: "This is the body of the post",
        published: true,
      };

    },
    */
  },
};

//Run query
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
