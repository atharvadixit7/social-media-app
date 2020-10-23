import React, { useContext } from "react"
import { gql, useQuery } from "@apollo/client"
import {
  Button,
  Card,
  Grid,
  Icon,
  Label,
  Image,
  Loader,
  Dimmer,
} from "semantic-ui-react"
import moment from "moment"

import LikeButton from "../components/LikeButton"
import DeletePost from "../components/DeletePost"

import { AuthContext } from "../context/auth"

const SinglePost = (props) => {
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)
  // console.log("Post id", postId)
  const { data } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
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
                {user && user.username === username && (
                  <DeletePost postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
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

export default SinglePost
