import React, { Component } from 'react';
import firebase from 'firebase';

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionState: ""
    }
  }

  render() {
    return (
      <header className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item" href="tictactoe-jolt.web.app">
              <img src="./logo192.png" alt="logo"></img>
            </a>
          </div>

          <div className="navbar-end">
              <label className="label">
                {this.state.connectionState}
              </label>
              <a className="navbar-item" href='/game'>About</a>
          </div>
        </div>
      </header>
    );
  }
}

export default Nav;
