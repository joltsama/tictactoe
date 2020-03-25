import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fire from './fire';
import Nav from './navbar';
import Register from './register';
import Game from './game';
import './app.scss'

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Register />
        <Game />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

