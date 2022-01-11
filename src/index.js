import { GraphQLServer } from "graphql-yoga";

//type definition (schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!
    add(a: Float!, b:Float!): String!
    addToArray(numbers:[Float!]!): Float!
    grades:[Int!]!
    me: User!
    post: Post!

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
    greeting: (_, { name }) => `Hello ${name || "World"}`,
    add: (_, { a, b }) => `My result is ${a + b || "null"}`,

    addToArray(parent, args, context, info) {
      if (args.numbers.length === 0) {
        return 0;
      }
      return args.numbers.reduce((accumulateur, currentValue) => {
        return accumulateur + currentValue;
      });
    },
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
  },
};

//Run query
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
