import React from 'react'
import { Component } from 'react'
import firebase from 'firebase'
import 'bulma'

function Navbar(props) {
  return (
    <header class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="tictactoe-jolt.web.app">
            <div class="title">tictactoe</div>
          </a>
        </div>
        <div class='navbar-menu'>
          <div class="navbar-end">
            <a class="navbar-item" href='/about'>About</a>
          </div>
        </div>
      </div>
    </header>
  );
}
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
      login: 1
    }
  }

  componentDidMount() {
    if (this.props.location.logout === 1) {
      firebase.auth().signOut().then(() => {
        this.setState({ login: 1 });
      });
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push('/game');
      }
    });
  }

  validate() {
    let valid = true;
    let userError = '';
    let passError = '';
    let emailError = '';
    if (this.state.user.length < 8 && this.state.login === 0) {
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
            alert('Email Verification Sent!');
          });
      }).catch(function (error) {

        this.setState({ authError: error.message });
        // if (error.code === 'auth/weak-password') {
        //   alert('The password is too weak.');
        // } else {
        //   alert(error,message);
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
        var password = this.state.pass;
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
          console.log('logged in');
          // let history = withRouter();
          // history.push('/game');
          this.props.history.push('/game');

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

    const loginclassName = "hero-body" + (this.state.login === 1 ? "" : " is-hidden");
    const signupclassName = "hero-body" + (this.state.login === 0 ? "" : " is-hidden");

    return (
      <section className="hero is-fullheight is-primary">
        <div className="hero-head">
          <Navbar />
        </div>
        <div className={loginclassName}>
          <div className="container">
            <div className="columns">

              <div className="column is-one-third">
                <div className="card">

                  <div className="card-content">
                    <p className="title" style={{color:"black"}}>Login</p>
                    <br />
                    <form className="form">
                      <div className="field">
                        <label className="label">Email</label>
                        <input className="input"
                          name="email"
                          value={this.state.email}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="email"
                        ></input>
                        <div className="help">{this.state.emailError}</div>
                      </div>
                      <div className="field">
                        <label className="label">Password</label>
                        <input
                          className="input"
                          type="password"
                          name="pass"
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="password"
                        ></input>
                      </div>
                      <div className="buttons">
                        <button
                          className="button is-primary"
                          onClick={(e) => { e.preventDefault(); this.login() }}
                        >Login</button>
                        <button
                          className="button"
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

        <div className={signupclassName}>
          <div className="container">
            <div className="columns">

              <div className="column is-one-third">
                <div className="card">

                  <div className="card-content">
                    <p className="title" style={{color:"black"}}>Signup</p>
                    <br />
                    <div className='help'>{this.state.authError}</div>
                    <form className="form">
                      <div className="field">
                        <label className="label">Username</label>
                        <input className="input"
                          name="user"
                          value={this.state.user}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="username"
                        ></input>
                        <div className="help">{this.state.userError}</div>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <input className="input"
                          name="email"
                          value={this.state.email}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="email"
                        ></input>
                        <div className="help">{this.state.emailError}</div>
                      </div>
                      <div className="field">
                        <label className="label">Password</label>
                        <input className="input" type="password"
                          div="pass"
                          name="pass"
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="password"
                        ></input>
                        <div className="help">{this.state.passError}</div>
                      </div>
                      <div className="buttons">
                        <button className="button is-primary" onClick={(e) => { e.preventDefault(); this.signup() }}>Signup</button>
                        <button className="button" onClick={(e) => { e.preventDefault(); this.setState({ login: 1 }) }}>Login</button>
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