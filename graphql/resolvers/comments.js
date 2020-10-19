import Apollo from 'apollo-server'
import Post from '../../models/Post.js'
import checkAuth from '../../utils/checkAuth.js'

const { UserInputError, AuthenticationError } = Apollo

export default {
  Query: {},
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context)
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty'
          }
        })
      }

      const post = await Post.findById(postId)
      if (post) {
        post.comments.unshift({
          body,
          createdAt: new Date().toISOString(),
          username,
        })
        await post.save()
        return post
      }
      else {
        throw new UserInputError('Post not found')
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context)
      const post = await Post.findById(postId)

      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId)

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1)
          await post.save()
          return post
        }
        else {
          throw new AuthenticationError('Action not allowed')
        }
      }
      else {
        throw new AuthenticationError('Post not found')
      }
    }
  }
}