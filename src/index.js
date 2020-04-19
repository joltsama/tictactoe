import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'
import firebase from 'firebase';
import Login from './components/login';
import Game from './components/game';
import Profile from './components/profile';
import Notfound from './components/notfound'
import './app.scss'
// import 'bulma'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    firebase.auth().currentUser !== null
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
)

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}></Route>
          <PrivateRoute exact path="/" component={Game}></PrivateRoute>
          <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
          <Route component={Notfound} />
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

