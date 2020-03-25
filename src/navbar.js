import React, { Component } from 'react';
import firebase from 'firebase';

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionState: "You are not connected"
    }
  }

  componentWillMount() {
    let conn = "";
    let connectedRef = firebase.database().ref(".info/connected");
    // setTimeout(() => {
    connectedRef.on("value", function (snap) {
      if (snap.val() === true) {
        conn = "You are connected";
      }
      console.log(conn);
    });    

    // }, 1000);

    // this.setState({
    //   connectionState: conn
    // });

  }

  render() {

    return (
      <nav class="navbar">
        <div class="navbar-brand">
          <a class="navbar-item" href="tictactoe-jolt.web.app">
            <img src="./logo192.png"></img>
          </a>
        </div>

        <div class="navbar-menu">
          <div class="navbar-start">
            <div class="navbar-item">
              About
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <label class="label">
              {this.state.connectionState}
            </label>
          </div>
        </div>

      </nav>
    );
  }
}

export default Nav;
