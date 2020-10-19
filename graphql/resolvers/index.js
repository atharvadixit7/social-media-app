import postsResolvers from "./posts.js"
import usersResolvers from "./users.js"
import commentsResolvers from './comments.js'

export default {
  Post: { //INFO:This is a modifier whenever a Post is returned through Query Mutation or Subscription it runs
    likeCount: parent => parent.likes.length
    ,
    commentCount: parent => parent.comments.length
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  }
}
