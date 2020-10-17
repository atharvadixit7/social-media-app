import pkg from "apollo-server"
import gql from "graphql-tag"
import mongoose from "mongoose"
import envs from "./config.js"

import Post from "./models/Post.js"

const { ApolloServer } = pkg

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find()
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

mongoose
  .connect(envs.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo DB Connected")
    return server.listen({ port: 5000 })
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`)
  })
