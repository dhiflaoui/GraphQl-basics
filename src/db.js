const users = [
  {
    id: "4",
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
    author: "4",
  },
  {
    id: "11",
    title: "GraphQL post 2",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "4",
  },
  {
    id: "12",
    title: "GraphQL post 3",
    body: "",
    published: true,
    author: "2",
  },
];
const comments = [
  {
    id: "20",
    text: "Comment one",
    author: "4",
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
