import Apollo from "apollo-server"

import Post from "../../models/Post.js"
import checkAuth from "../../utils/checkAuth.js"

const { UserInputError, AuthenticationError } = Apollo

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

      if (body.trim() === '') {
        throw new Error('Post body must not be empty')
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()

      context.pubsub.publish('NEW__POST', {
        newPost: post
      })
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
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context)

      const post = await Post.findById(postId)

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          //DONE: Post already exists so unlike it
          post.likes = post.likes.filter(like => like.username !== username)
          await post.save()
        }
        else {
          //DONE: Not liked like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save()
        return post
      }
      else {
        throw new UserInputError('Post not found')
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW__POST')
    }
  }
}
