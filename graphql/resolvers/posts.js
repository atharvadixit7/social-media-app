import Apollo from "apollo-server"

import Post from "../../models/Post.js"
import checkAuth from "../../utils/checkAuth.js"

const { AuthenticationError } = Apollo

export default {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        } else {
          throw new Error("Post not found")
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context)
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()
      return post
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(postId)
        if (user.username === post.username) {
          await post.deleteOne()
          return "Post deleted successfully"
        } else {
          throw new AuthenticationError("Action denied")
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
