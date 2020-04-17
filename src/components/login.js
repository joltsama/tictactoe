import React from 'react'
import { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom';
import 'bulma'

function Navbar(props) {
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <div className="title">tictactoe</div>
        </div>
        <div className='navbar-menu'>
          <div className="navbar-end">
            <Link className="navbar-item" to={{
              pathname: '/about',
            }}>About</Link>
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
      login: 1,
      notification: ''
    }
  }

  componentDidMount() {
    if (this.props.location.logout === 1) {
      firebase.auth().signOut().then(() => {
        this.setState({ login: 1 });
      });
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user && firebase.auth().currentUser.emailVerified) {
        this.props.history.push('/');
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

  setNotification(message, hide = true) {
    if (hide === true) {
      this.setState({
        notification: <div className="notification">{message}</div>
      });
      setTimeout(() => this.setState({ notification: "" }), 5000);
    }
    else {
      this.setState({
        notification: <div className="notification">{message}</div>
      });
    }
  }

  signup() {
    const isValid = this.validate();
    if (isValid) {
      console.log("signup");
      var email = this.state.email;
      var password = this.state.pass;
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
            username: this.state.user,
            email: this.state.email,
            wins: 0
          });
          firebase.database().ref('/idtouid/').update({
            username: firebase.auth().currentUser.uid
          });
          console.log('registered');
        })
        .then(() => {
          firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
              this.setState({ login: 1 });
              this.setNotification('Please verifiy your email');
            });
        })
        .catch((error) => {
          this.setNotification(error.message);
        });
    }
  }

  login() {
    const isValid = this.validate();
    if (isValid) {
      let auth = firebase.auth();
      if (auth.currentUser) {
        auth.signOut();
      } else {
        var email = this.state.email;
        var password = this.state.pass;
        auth.signInWithEmailAndPassword(email, password).then(() => {
          if (auth.currentUser.emailVerified) {
            console.log('logged in');
            this.props.history.push('/');
          } else {
            this.setNotification('Please verifiy your email address.')
          }
        }).catch((error) => {
          if (error.code === 'auth/wrong-password') {
            this.setNotification('Wrong password.');
          } else {
            this.setNotification(error.message, false);
          }
        });
      }
    }
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === 'email') {
      this.setState({ user: e.target.value.split('@')[0] });

    }
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
                    <p className="title" style={{ color: "black" }}>Login</p>
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
                      {this.state.notification}
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
                    <p className="title" style={{ color: "black" }}>Signup</p>
                    <br />
                    <form className="form">
                      <div className="field">
                        <label className="label">Username</label>
                        <input className="input"
                          name="user"
                          value={this.state.user}
                          placeholder="username"
                          readOnly
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
                      {this.state.notification}
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