import { GraphQLServer } from "graphql-yoga";
import uuidV4 from "uuid/v4";
// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "anderson",
    email: "anderson@gmail.com",
    age: 27,
  },
  {
    id: "2",
    name: "mylina",
    email: "sarah@gmail.com",
  },
  {
    id: "3",
    name: "Michel",
    email: "Michel@gmail.com",
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL post 1",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL post 2",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1",
  },
  {
    id: "12",
    title: "GraphQL post 3",
    body: "",
    published: false,
    author: "2",
  },
];
const comments = [
  {
    id: "20",
    text: "Comment one",
    author: "1",
    post: "10",
  },
  {
    id: "21",
    text: "Comment two",
    author: "3",
    post: "11",
  },
  {
    id: "22",
    text: "Comment three",
    author: "2",
    post: "12",
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation{
        createUser(userData: CreateUserInput!): User!
        createPost(postData: CreatePostInput!): Post!
        createComment( commentData:CreateCommentInput!): Comment!
    }

    input CreateUserInput{
      name:String!
      email:String!
      age:Int
    }
    input CreatePostInput{
      title: String!,
      body: String!,
      published: Boolean!,
      author: ID!
    }
    input CreateCommentInput{
      text: String!,
      author: ID!,
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        posts: [Post!]!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com",
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: false,
      };
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  //crud opertions
  Mutation: {
    /**************************create************************************/
    //create user
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(
        (user) => user.email === args.userData.email
      );
      if (emailTaken) {
        throw new Error(`email taken`);
      }

      const user = {
        id: uuidV4(),
        ...args.userData,
        // name: args.name,
        // email: args.email,
        // age: args.age,
      };

      users.push(user);
      return user;
    },

    //create post
    createPost(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.postData.author);
      if (!userExist) {
        throw new Error(`User not found`);
      }
      const post = {
        id: uuidV4(),
        ...args.postData,
        // title: args.title,
        // body: args.body,
        // published: args.published,
        // author: args.author,
      };
      posts.push(post);
      return post;
    },

    //create comment
    createComment(parent, args, ctx, info) {
      const userExist = users.some(
        (user) => user.id === args.commentData.author
      );
      const postExist = posts.some(
        (post) => post.id === args.commentData.post && post.published
      );

      if (!userExist || !postExist) {
        throw new Error(`Unable to find user or post`);
      }

      const comment = {
        id: uuidV4(),
        ...args.commentData,
        //   text: args.text,
        //   author: args.author,
        //   post: args.post,
      };
      comments.push(comment);
      return comment;
    },
    /**************************Delete************************************/
  },
  //Relational Data Basics
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    posts(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
