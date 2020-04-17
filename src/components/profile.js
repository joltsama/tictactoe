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
              pathname: '/',
            }}>Game</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      email: '',
      userError: '',
      passError: '',
      authError: '',
      notification: '',
      edit: 0,
      wins: 0
    };
    this.loadProfile.bind(this);
  }

  loadProfile() {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value')
      .then((snapshot) => {
        this.setState({
          user: snapshot.val().username,
          email: snapshot.val().email,
          wins: snapshot.val().wins
        });
      });
  }

  componentWillMount() {
    this.loadProfile();
  }

  componentDidMount() {
    // this.loadProfile();
    // let database = firebase.database();
    // database.ref('users/' + this.state.player1).on('value', function (snapshot) {
    //   if (snapshot !== false) {
    //     this.setState({ player1: snapshot.val().user });
    //   }
    // });
  }

  validate() {
    let valid = true;
    let userError = '';
    let passError = '';

    if (this.state.user.length < 8 && this.state.edit === 0) {
      userError = "User name must be greater than 7 in length";
      valid = false;
    }

    if (this.state.pass.length < 8) {
      valid = false;
      passError = 'Password too weak'
    }

    this.setState({
      userError,
      passError
    })
    return valid;
  }

  edit() {
    const isValid = this.validate();
    if (isValid) {
      console.log("edit");
      var password = this.state.pass;
    }
    console.log('sdf ');
    console.log(this.state.notification);
    this.setState({
      edit: 0,
      notification: <div className="notification">Changes have been saved.</div>
    });
    setTimeout(() => this.setState({ notification: "" }), 3000);

  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {

    const profileClassName = "hero-body " + (this.state.edit === 0 ? "" : "is-hidden");
    const profileEditClassName = "hero-body " + (this.state.edit === 1 ? "" : "is-hidden");

    return (
      <section className="hero is-fullheight is-primary">
        <div className="hero-head">
          <Navbar />
        </div>
        <div className={profileEditClassName}>
          <div className="container">
            <div className="columns">

              <div className="column is-one-third">
                <div className="card">

                  <div className="card-content">
                    <p className="title" style={{ color: "black" }}>Edit</p>
                    <br />
                    <form className="form">
                      <div className="field">
                        <label className="label">Username</label>
                        <input className="input"
                          name="user"
                          value={this.state.user}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="Username"
                          readOnly
                        ></input>
                        <div className="help">{this.state.emailError}</div>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <input className="input"
                          name="email"
                          value={this.state.email}
                          onChange={(e) => { this.handleChange(e); }}
                          placeholder="email"
                          readOnly
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
                          onClick={(e) => { e.preventDefault(); this.edit() }}
                        >Save</button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        <div className={profileClassName}>
          <div className="container">
            <div className="columns">

              <div className="column is-one-third">
                <div className="card">

                  <div className="card-content">
                    <p className="title" style={{ color: "black" }}>Profile</p>
                    <br />
                    {this.state.notification}
                    <div className='help'>{this.state.authError}</div>
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
                          placeholder="email"
                          readOnly
                        ></input>
                        <div className="help">{this.state.emailError}</div>
                      </div>
                      <p>
                        Wins : {this.state.wins}
                      </p>
                      <div className="buttons">
                        {/* <button className="button" onClick={(e) => { e.preventDefault(); this.setState({ edit: 1 }) }}>Edit</button> */}
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

export default Profile;