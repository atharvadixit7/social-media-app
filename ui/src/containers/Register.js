import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

import { useForm } from '../util/hooks'

const Register = (props) => {
  //DONE: 
  const [errors, setErrors] = useState(() => { })
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push('/')
    },
    //DONE: 
    onError(err) {
      console.log(err.graphQLErrors)
      if (err.graphQLErrors) {
        const errors = err.graphQLErrors[0].extensions.errors
        setErrors(errors)
      }
    },
    variables: {
      ...values
    }
  })

  function registerUser() {
    addUser()
  }

  return (
    <div className='form-container'>
      <Form autoComplete='off' onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          type='text'
          label='Username'
          placeholder='Username...'
          name='username'
          error={errors?.username ? true : false}
          value={values.username}
          onChange={onChange} />
        <Form.Input
          type='email'
          label='Email'
          placeholder='Email...'
          name='email'
          error={errors?.email ? true : false}
          value={values.email}
          onChange={onChange} />
        <Form.Input
          label='Create a Password'
          placeholder='Create a Password...'
          name='password'
          error={errors?.password ? true : false}
          value={values.password}
          onChange={onChange} />
        <Form.Input
          type='password'
          label='Confirm Your Password'
          placeholder='Confirm Your Password...'
          error={errors?.password ? true : false}
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange} />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {/* DONE: */}
      {errors && (Object.keys(errors).length > 0) && (
        <div className="ui error message">
          <ul>
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>)}
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username:String!
    $email:String!
    $password:String!
    $confirmPassword:String!
  ){
    register(registerInput:{
      username:$username
      email:$email
      password:$password
      confirmPassword:$confirmPassword
    }){
      id email username createdAt token
    }
  }
`

export default Register