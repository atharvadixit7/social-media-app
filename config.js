import dotenv from "dotenv"
dotenv.config()

const envs = {
  MONGODB: process.env.MONGODB,
  SECRET_KEY: process.env.SECRET_KEY,
}

export default envs
