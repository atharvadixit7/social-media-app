import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import { Button, Confirm, Icon, Popup } from "semantic-ui-react"
import { FETCH_POSTS_QUERY } from "../util/queries"
import MyPopup from "../util/MyPopup"

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(() => false)
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
  const [deletePostOrComment] = useMutation(mutation, {
    variables: {
      postId,
      commentId,
    },
    update(proxy) {
      setConfirmOpen(false)
      //TODO: remove post from cache
      if (!commentId) {
        let data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        })
        if (data) {
          data = { getPosts: [...data.getPosts.filter((p) => p.id !== postId)] }
          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data,
          })
        }
      }
      if (callback) callback()
    },
  })
  return (
    <>
      <MyPopup content={`Delete ${commentId ? "Comment" : "Post"}`}>
        <Button
          as="div"
          color="grey"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`
export default DeleteButton
