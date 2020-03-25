import React from 'react'
import { Component } from 'react'
import { Content } from 'bulma'

class Register extends Component {
  render() {
    return (
      <section class="hero is-large">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Register
            </h1>
            <form class="form">
              <div class="field">
                <label class="label">Username</label>
                <input class="input" placeholder="username"></input>
              </div>
              <div class="field">
                <button class="button">OK</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;