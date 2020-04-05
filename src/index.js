import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'
// import fire from './fire';
import firebase from 'firebase';
// import Nav from './navbar';
import Login from './login';
import Game from './game';
import Notfound from './notfound'
import './app.scss'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    firebase.auth().currentUser
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
  )} />
)

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <PrivateRoute exact path="/game" component={Game}></PrivateRoute>
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

