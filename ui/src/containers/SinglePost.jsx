import React, { useContext, useRef, useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import {
  Button,
  Card,
  Grid,
  Icon,
  Label,
  Image,
  Loader,
  Dimmer,
  Form,
  Transition,
} from "semantic-ui-react"
import moment from "moment"

import LikeButton from "../components/LikeButton"
import DeleteButton from "../components/DeleteButton"
import MyPopup from "../util/MyPopup"

import { AuthContext } from "../context/auth"

const SinglePost = (props) => {
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)

  const commentInputRef = useRef(null)

  const [comment, setComment] = useState(() => "")
  //INFO: For debug console.log("Post id", postId)
  const { data } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
    },
  })

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("")
      commentInputRef.current.blur()
    },
    variables: {
      postId,
      body: comment,
    },
  })
  function deletePostCallback() {
    props.history.push("/")
  }
  let postMarkup
  if (!data) {
    postMarkup = (
      <Dimmer active>
        <Loader size="massive">Loading</Loader>
      </Dimmer>
    )
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likeCount,
      commentCount,
      likes,
    } = data.getPost
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size="small"
              float="right"
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("Comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        ref={commentInputRef}
                        type="text"
                        placeholder="Write your Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button violet"
                        disabled={comment.trim() === ""}
                        onClick={createComment}
                      >
                        Post
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            <Transition.Group duration={500} animation="zoom">
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return postMarkup
}

const FETCH_POSTS_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

const CREATE_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`

export default SinglePost
