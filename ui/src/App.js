import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import MenuBar from './components/MenuBar'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

const App = () => {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={Home} />
      </Container>
    </ Router>
  );
}

export default App;
