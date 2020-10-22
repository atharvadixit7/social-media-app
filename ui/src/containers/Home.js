import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/queries'

import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'

const Home = () => {
  const { user } = useContext(AuthContext)
  let { loading, data } = useQuery(FETCH_POSTS_QUERY)
  let posts
  // INFO: for dev debug console.log('Dataaaaaaaaaa', data)
  if (data) {
    posts = data.getPosts
  }
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (<h1>Loading Posts...</h1>) : (
          posts && posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: "18px" }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}




export default Home