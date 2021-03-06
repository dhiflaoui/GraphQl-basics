import uuidv4 from "uuid/v4";

const Mutation = {
  /**************************create***************************** */
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    //subscription
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExists || !postExists) {
      throw new Error("Unable to find user and post");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  /******************************Delete************************************/
  //user
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },

  //post
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    //subscription
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },

  //comment
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComments = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComments[0];
  },

  /******************************update*********************************** */
  //update user
  updateUser(parent, args, { db }, info) {
    //the user exist ???
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }
    //email verification before adding (email taken or not)
    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }
      user.email = data.email;
    }
    //name verification before adding
    if (typeof data.name === "string") {
      user.name = data.name;
    }
    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }
    return user;
  },

  //update post
  updatePost(parent, args, { db, pubsub }, info) {
    //the post exist ???
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }
    if (typeof data.title === "string") {
      post.title = data.title;
    }
    //body verification before adding
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;

      //subscription
      if (originalPost.published && !post.published) {
        //deleted verif
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //created verif
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      //updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }
    return post;
  },

  //comment
  updateComment(parent, args, { db, pubsub }, info) {
    //the comment exist ???
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
