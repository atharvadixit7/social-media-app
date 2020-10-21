import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Apollo from "apollo-server"

const { UserInputError } = Apollo

import User from "../../models/User.js"
import envs from "../../config.js"
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../utils/validate.js"
import resolvers from "./index.js"

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    envs.SECRET_KEY,
    { expiresIn: "1h" }
  )
}

export default {
  Query: {},
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password)
      if (!valid) {
        throw new UserInputError("Errors", { errors })
      }

      const user = await User.findOne({ username })
      if (!user) {
        errors.general = "Wrong Credentials"
        throw new UserInputError("Wrong credentials", { errors })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = "Wrong Credentials"
        throw new UserInputError("Wrong credentials", { errors })
      }
      const token = generateToken(user)
      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },
    register: async (
      _,
      { registerInput: { username, password, email, confirmPassword } },
      context,
      info
    ) => {
      //DONE: Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      )
      if (!valid) {
        throw new UserInputError("Errors", { errors })
      }
      //DONE: Make sure user doesn't exist
      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError("Username already exists", {
          errors: {
            username:
              "This username already exists please try some other username",
          },
        })
      }
      //DONE: hash password and create an auth token
      password = await bcrypt.hash(password, 12)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      })

      const res = await newUser.save()

      const token = generateToken(resolvers)

      return {
        ...res._doc,
        id: res._id,
        token,
      }
    },
  },
}
