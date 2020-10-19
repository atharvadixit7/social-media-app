import Apollo from "apollo-server"
import mongoose from "mongoose"
import envs from "./config.js"

import resolvers from "./graphql/resolvers/index.js"
import typeDefs from "./graphql/typeDefs.js"

const { ApolloServer } = Apollo

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
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
