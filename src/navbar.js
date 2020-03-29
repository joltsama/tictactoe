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
      <header class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item" href="tictactoe-jolt.web.app">
              <img src="./logo192.png" alt="logo"></img>
            </a>
          </div>

          <div class="navbar-end">
              <label class="label">
                {this.state.connectionState}
              </label>
    
              <a class="navbar-item" href='/about'>About</a>
          </div>
        </div>
      </header>
    );
  }
}

export default Nav;
