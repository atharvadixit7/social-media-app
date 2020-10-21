import React from 'react'
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'


const PostCard = ({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) => {
  const likePost = () => {
    console.log('Like!!')
  }
  const commentOnPost = () => {
    console.log('Comment!!')
  }
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='left'
          size='tiny'
          src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button //INFO: Like Button
          onClick={likePost}
          basic={true}
          color='red'
          content=' '
          icon='heart'
          label={{ basic: true, color: 'red', pointing: 'left', content: likeCount }}
        />
        <Button //INFO: Comment Button
          onClick={commentOnPost}
          basic={true}
          color='violet'
          content=' '
          icon='comments'
          label={{ basic: true, color: 'violet', pointing: 'left', content: commentCount }}
        />
      </Card.Content>
    </Card>
  )

}

export default PostCard