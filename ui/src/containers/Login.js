import React, { useState, useContext } from "react"
import { Button, Form } from "semantic-ui-react"
import { gql, useMutation } from "@apollo/client"

import { useForm } from "../util/hooks"
import { AuthContext } from "../context/auth"

const Login = (props) => {
  const context = useContext(AuthContext)
  //DONE:
  const [errors, setErrors] = useState(() => {})
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  })
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      //INFO: This is only for debugging console.log('Resulllllllllt', userData)
      context.login(userData)
      props.history.push("/")
    },
    //DONE:
    onError(err) {
      //INFO: This is only for debugging console.log(err.graphQLErrors)
      if (err.graphQLErrors) {
        const errors = err.graphQLErrors[0].extensions.errors
        setErrors(errors)
      }
    },
    variables: {
      ...values,
    },
  })

  function loginUserCallback() {
    loginUser()
  }

  return (
    <div className="form-container">
      <Form
        autoComplete="off"
        onSubmit={onSubmit}
        className={loading ? "loading" : ""}
      >
        <h1>Login</h1>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          error={errors?.username ? true : false}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Enter the Password..."
          name="password"
          error={errors?.password ? true : false}
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          LOGIN
        </Button>
      </Form>
      {/* DONE: */}
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul>
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login
