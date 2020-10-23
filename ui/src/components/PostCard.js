import React, { useContext } from "react"
import { Button, Card, Image } from "semantic-ui-react"
import moment from "moment"
import { Link } from "react-router-dom"

import { AuthContext } from "../context/auth"
import LikeButton from "./LikeButton"
import DeleteButton from "./DeleteButton"

const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext)
  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image
          floated="left"
          size="tiny"
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button //INFO: Comment Button
          as={Link}
          to={`/posts/${id}`}
          basic={true}
          color="violet"
          content=""
          icon="comments"
          label={{
            basic: true,
            color: "violet",
            pointing: "left",
            content: commentCount,
          }}
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  )
}

export default PostCard
