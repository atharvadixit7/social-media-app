import dotenv from "dotenv"
dotenv.config()

const envs = {
  MONGODB: process.env.MONGODB,
}

export default envs
