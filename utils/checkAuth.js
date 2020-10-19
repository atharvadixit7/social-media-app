import jwt from "jsonwebtoken"
import envs from "../config.js"
import Apollo from "apollo-server"

const { SECRET_KEY } = envs
const { AuthenticationError } = Apollo

export default (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1]
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token")
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]")
  }
  throw new Error("Authorization header must be provided")
}
