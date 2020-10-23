import React from "react"
import { Button, Form } from "semantic-ui-react"
import { useMutation } from "@apollo/client"

import { useForm } from "../util/hooks"

import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from "../util/queries"

const PostForm = () => {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  })
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      let data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      })
      // DONE:
      // console.log("dataaaaaaaaaa",data)
      // console.log('Resultttttt',result)
      data = { getPosts: [result.data.createPost, ...data.getPosts] }
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data, //INFO: This is not the correct way[result.data.createPost,...data.getPosts]
      })
      // console.log('Valuessssss',values)
      values.body = ""
    },
  })
  function createPostCallback() {
    createPost()
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Write your post here...."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="violet">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: "20px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

export default PostForm
