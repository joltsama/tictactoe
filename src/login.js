import React from 'react'
import firebase from 'firebase'
import fire from './fire'
import { Component } from 'react'
import { Content } from 'bulma'
import Navbar from './navbar'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      email: '',
      userError: '',
      passError: '',
      emailError: '',
      authError: '',
      login: 0
    }
  }

  validate() {
    let valid = true;
    let userError = '';
    let passError = '';
    let emailError = '';
    if (this.state.user.length < 8) {
      userError = "User name must be greater than 7 in length";
      valid = false;
    }
    if (!this.state.email.includes('@')) {
      valid = false;
      emailError = 'Invalid email address'
    }
    if (this.state.pass.length < 8) {
      valid = false;
      passError = 'Password too weak'
    }

    this.setState({
      userError,
      emailError,
      passError
    })
    return valid;
  }

  signup() {
    const isValid = this.validate();
    if (isValid) {
      console.log("signup");
      var email = this.state.email;
      var password = this.state.pass;
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        console.log('signed in');
        firebase.auth().currentUser.sendEmailVerification()
          .then(function () {
            // Email Verification sent!
            alert('Email Verification Sent!');
          });
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({ authError: errorMessage });
        // if (errorCode === 'auth/weak-password') {
        //   alert('The password is too weak.');
        // } else {
        //   alert(errorMessage);
        // }
        // console.log(error);
      });
    }
  }

  login() {
    const isValid = this.validate();
    if (isValid) {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        var email = this.state.email;
        var password = this.state.email;
        firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
          console.log('logged in');
          //go to game page
        }).catch(function (error) {
          if (error.code === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(error.message);
          }
          console.log(error);
          // document.getElementById('quickstart-sign-in').disabled = false;
        });
      }
      // document.getElementById('quickstart-sign-in').disabled = true;
    }
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {

    const loginclass = "hero-body" + (this.state.login === 1 ? "" : " is-hidden");
    const signupClass = "hero-body" + (this.state.login === 0 ? "" : " is-hidden");

    return (
      <section class="hero is-large is-light">
        <div class="hero-head">
          <Navbar />
        </div>
        <div class={loginclass}>
          <div class="container">
            <div class="columns">

              <div class="column is-one-third">
                <div class="card">

                  <div class="card-content">
                    <p class="title">Login</p>
                    <br />
                    <form class="form">
                      <div class="field">
                        <label class="label">Email</label>
                        <input class="input"
                          name="email"
                          value={this.state.email}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="email"
                        ></input>
                        <div class="help">{this.state.emailError}</div>
                      </div>
                      <div class="field">
                        <label class="label">Password</label>
                        <input
                          class="input"
                          type="password"
                          div="pass"
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="password"
                        ></input>
                      </div>
                      <div class="buttons">
                        <button
                          class="button is-primary"
                          onClick={(e) => { e.preventDefault(); this.login() }}
                        >Login</button>
                        <button
                          class="button"
                          onClick={(e) => { e.preventDefault(); this.setState({ login: 0 }) }}
                        >Signup</button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        <div class={signupClass}>
          <div class="container">
            <div class="columns">

              <div class="column is-one-third">
                <div class="card">

                  <div class="card-content">
                    <p class="title is-dark">Signup</p>
                    <br />
                    <div class='help'>{this.state.authError}</div>
                    <form class="form">
                      <div class="field">
                        <label class="label">Username</label>
                        <input class="input"
                          name="user"
                          value={this.state.user}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="username"
                        ></input>
                        <div class="help">{this.state.userError}</div>
                      </div>
                      <div class="field">
                        <label class="label">Email</label>
                        <input class="input"
                          name="email"
                          value={this.state.email}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="email"
                        ></input>
                        <div class="help">{this.state.emailError}</div>
                      </div>
                      <div class="field">
                        <label class="label">Password</label>
                        <input class="input" type="password"
                          div="pass"
                          name="pass"
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="password"
                        ></input>
                        <div class="help">{this.state.passError}</div>
                      </div>
                      <div class="buttons">
                        <button class="button is-primary" onClick={(e) => { e.preventDefault(); this.signup() }}>Signup</button>
                        <button class="button" onClick={(e) => { e.preventDefault(); this.setState({ login: 1 }) }}>Login</button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;