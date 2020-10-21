import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import MenuBar from './components/MenuBar'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/" component={Home} />
        </Container>
      </ Router>
    </AuthProvider>

  );
}

export default App;
