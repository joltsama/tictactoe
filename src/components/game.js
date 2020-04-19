import React from 'react';
import fire from '../fire';
// import 'bulma';
// import './app.scss'
import firebase from 'firebase';
import { Redirect, Link } from 'react-router-dom';


function Navbar(props) {
  const Navv =
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-item">
            <div className="title">tictactoe</div>
          </div>
          <a role="button" class="navbar-burger" aria-label="menu" data-target="navMenu" aria-expanded="false"
            onClick={()=>props.toggleNavMenu()}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navMenu" className={"navbar-menu" + (props.menuvisible === true ? " is-active" : "")}>
          <div className="navbar-end">
            <Link className="navbar-item" to={{
              pathname: '/profile',
            }}>Profile</Link>
            <Link className="navbar-item" to={{
              pathname: '/login',
              logout: 1
            }}>Logout</Link>
          </div>
        </div>
      </div>
    </nav>;
  return (
    Navv
  );
}

function Square(props) {
  return (
    <button className="button" onClick={() => props.onClick()}> {props.value} </button>
  );
}

function extractSquares(moves, startX) {
  let squares = Array(9).fill(null);
  for (var i = 1; i < moves.length; i++) {
    squares[parseInt(moves[i])] = ((i) % 2 === 1 ? 'X' : 'O');
  }
  return squares;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return "Winner-"+squares[a];
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null)
      return null;

  }
  return "Draw";
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => { this.props.onClick(i) }} />;
  }

  render() {
    return (
      <table>
        <tr>
          <td>{this.renderSquare(0)}</td>
          <td>{this.renderSquare(1)}</td>
          <td>{this.renderSquare(2)}</td>
        </tr>
        <tr>
          <td>{this.renderSquare(3)}</td>
          <td>{this.renderSquare(4)}</td>
          <td>{this.renderSquare(5)}</td>
        </tr>
        <tr>
          <td>{this.renderSquare(6)}</td>
          <td>{this.renderSquare(7)}</td>
          <td>{this.renderSquare(8)}</td>
        </tr>
      </table>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      moves: "s",
      matchFooter: <p>Invite a friend to play.</p>,
      player1: '',
      player2: '',
      gameState: 0,
      invFrom: '',
      gamedir: '',
      startX: 0,
      checkedPrev: 0,
      wins: 0,
      menuvisible: false
    };
    this.cancelInvitation = this.cancelInvitation.bind(this);
    this.toggleNavMenu = this.toggleNavMenu.bind(this);
  }

  async componentDidMount() {
    await this.setPlayerName();
    this.checkRunningGame();
    this.checkInvitation();

  }

  async setPlayerName() {  // working fine
    let promise = new Promise((res, rej) => {
      firebase.database().ref('/users/' + fire.auth().currentUser.uid).once('value')
        .then((result) => {
          this.setState({ player1: result.val().username, wins: result.val().wins });
          //console.log('username set', result.val().username);
        })
        .then(() => { res(1) })
        .catch((e) => { rej(e) });
    });
    return promise;
  }


  // Invitation ---------------------------

  inviteFriend() {  // working fine
    let database = firebase.database();
    database.ref("/idtouid/" + this.state.player2).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        database.ref('/session/' + this.state.player2).update({
          invFrom: this.state.player1
        })
          .then(() => {
            this.setState({ matchFooter: <p>{"Invitation sent to " + this.state.player2}</p> });
            setTimeout(() => {
              this.setState({ matchFooter: "" });
            }, 3000);
            //console.log('Invited', this.state.player2);
          })
          .catch((e) => { console.log(e) });
      } else {
        this.setState({ matchFooter: <div class="notification">User does not exist</div> });
        setTimeout(() => {
          this.setState({ matchFooter: "" });
        }, 5000);
      }
    });
  }

  checkInvitation() {  // working fine
    //console.log('check invites');
    firebase.database().ref('/session/' + this.state.player1 + '/invFrom').on('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== 'none') {
        this.setInvitation(snapshot.val());
      }
    })
  }

  setInvitation(username) {  // working fine
    const invitationButton =
      <div>
        <p>Invitation from {username}</p>
        <div className="buttons">
          <button className="button " onClick={() => this.acceptInvitation(username)}>Accept Invitation</button>
          <button className="button" onClick={this.cancelInvitation}>Cancel</button>
        </div>
      </div>;
    const res = {
      matchFooter: invitationButton
    };
    if (this.state.gameState === 0) {
      this.setState(res);
    }
  }

  acceptInvitation(player2) {  // working fine
    firebase.database().ref('/session/' + player2 + '/playing').once('value').then((snapshot) => {
      if (snapshot.val() === 1) {
        this.setState({ matchFooter: <p>Cant accept, the user is already in a match.</p> })
        return;
      }
    })
    this.setState({
      matchFooter: 'You play Os',
      player2: player2,
      gameState: 1,
      gamedir: '/session/' + player2 + '/game/'
    }, () => {
      firebase.database().ref('/session/' + player2 + '/').update({
        game: {
          moves: "s",
          player2: this.state.player1,
          startX: 1,
          gamedir: this.state.gamedir,
        },
        playing: 1
      })
        .then(() => {
          firebase.database().ref('/session/' + this.state.player1 + '/').update({
            game: {
              moves: "s",
              player2: player2,
              startX: 0,
              gamedir: this.state.gamedir,
            },
            invFrom: "none",
            playing: 1
          });
        })
        .then(() => {
          this.checkRunningGame();
        })
    });
  }

  cancelInvitation() { /// working fine
    this.setState({ matchFooter: '' });
    firebase.database().ref('/session/' + this.state.player1 + '/invFrom').set("none").catch((e) => console.log(e));
  }


  // Game Status ---------------------------------------
  checkRunningGame() {
    //console.log('check running game with username', this.state.player1);
    let listener = firebase.database().ref('/session/' + this.state.player1 + '/game/')
    listener.on('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val().player2 !== null && snapshot.val().player2 !== 'none') {
        const { gamedir, moves, startX, player2 } = snapshot.val();

        const gameState = {
          gamedir: gamedir,
          player2: player2,
          moves: moves,
          startX: startX,
          gameState: 1,
        };
        listener.off();
        this.startGame(gameState);
      }
    });

  }

  startGame(gameState) {
    this.setState(gameState);
    //console.log('resume game with username', this.state.player1);

    firebase.database().ref(this.state.gamedir).on('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val().player2 !== null && snapshot.val().player2 !== 'none') {
        const moves = snapshot.val().moves;
        const squares = extractSquares(moves, this.state.startX);
        const win = calculateWinner(squares);
        if (win !== null) {
          const winEl =
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">{win}</label>
              </div>
              <div class="field-body">
                <div className="field">
                  <div className="control">
                    <button className="button" onClick={() => this.resetGame(this.state.player2)}>Reset</button>
                  </div>
                </div>
              </div>
            </div>;


          this.setState({
            moves: moves,
            matchFooter: winEl
          });
          firebase.database().ref(/users/ + firebase.auth().currentUser.uid)
            .update({
              wins: this.state.wins + 1
            })
            .catch(e => console.log(e));
          return;
        }

        let turn = '';
        if (this.state.startX === 1 && snapshot.val().moves.length % 2 === 1) turn = 'Your turn';
        if (this.state.startX === 0 && snapshot.val().moves.length % 2 === 0) turn = 'Your turn';
        const currGameState = {
          matchFooter: <p>{turn}</p>,
          moves: moves
        };

        //console.log('currGameState', currGameState);
        this.setState(currGameState);
      }
    })
  }


  // Gameplay ----------------------------------------
  handleClick(i) {
    const moves = this.state.moves;
    if (moves.includes(String(i))) {
      return;
    }
    if (this.state.startX === 1 && moves.length % 2 === 0)
      return;
    if (this.state.startX === 0 && moves.length % 2 === 1)
      return;

    firebase.database().ref(this.state.gamedir).update({
      moves: this.state.moves + String(i)
    }).then(() => {
      //console.log('value updated', this.state.gamedir);
      //console.log(moves);
    }).catch(e => console.log(e));
  }

  resetGame(player2) {
    this.setState({
      matchFooter: '',
      player2: "none",
      gameState: 0,
      gamedir: "none",
      moves: "s"
    }, () => {
      firebase.database().ref('/session/' + player2 + '/').update({
        game: {
          moves: "s",
          player2: "none",
          startX: 0,
          gamedir: "none"
        },
        playing: 0
      })
        .then(() => {
          firebase.database().ref('/session/' + this.state.player1 + '/').update({
            game: {
              moves: "s",
              player2: "none",
              startX: 0,
              gamedir: "none"
            },
            invFrom: "none",
            playing: 0
          });
        })
        .then(() => {
          this.checkRunningGame();
        })
    });
  }

  addMessage(e) {
    e.preventDefault();
    fire.database().ref('messages').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input
  }


  // Misc ---------------------------------
  logout() {
    firebase.auth().signOut().then(function () {
      //console.log('logged out');
      return <Redirect to='/login' />;
    });
  }

  toggleNavMenu() {
    this.setState({menuvisible: !this.state.menuvisible});
  }

  render() {


    let squares = extractSquares(this.state.moves, this.state.startX);
    // const winner = calculateWinner(squares);

    // this.state.messages.map(message => <li key={message.id}>{message.text}</li>);

    return (
      <section className="hero is-fullheight ">

        <div className="hero-head">
          <Navbar toggleNavMenu={this.toggleNavMenu} menuvisible={this.state.menuvisible} />
        </div>

        <div className="hero-body">
          <div className="container">

            {/* Lets play and invite */}
            <section class={"section" + (this.state.gameState === 1 ? " is-hidden" : "")}>
              <h1 className="title">Let's play!</h1>
              <div className={"field is-grouped " + (this.state.gameState === 1 ? "is-hidden" : "")}>
                <div className="control is-expanded">
                  <input
                    className="input"
                    placeholder="Username"
                    value={this.setState.player2}
                    onChange={e => { e.preventDefault(); this.setState({ player2: e.target.value }); }}
                  />
                </div>
                <div className="control">
                  <button
                    className="button"
                    onClick={() => this.inviteFriend()}
                  >Invite a friend</button>
                </div>
              </div>
              {this.state.matchFooter}
            </section>

            {/* Game Coloumns */}
            <div class={(this.state.gameState === 0 ? " is-hidden" : "")}>
              <h1 className="title">Play!</h1>
              <div className="columns">

                {/* Game Board */}
                <div className="column">

                  <div className="card">

                    <div className="columns">
                      <div className="column has-text-centered">
                        <label className="label is-normal">{this.state.player1}</label>
                      </div>
                      <div className="column has-text-centered is-narrow">
                        <span className="tag">VS</span>
                      </div>
                      <div className="column has-text-centered">
                        <label className="label is-normal">{this.state.player2}</label>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="game">
                        <div className="gameboard">
                          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="card-footer-item">
                        {this.state.matchFooter}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Msgs */}
                <div className="column">
                  {/* /*  coloumn 3 ---------------------------------------------------------- */}

                  <form onSubmit={this.addMessage.bind(this)}>
                    <div className="field is-grouped">
                      <div className="control is-expanded">
                        <input className="input" placeholder="Type message" ref={el => this.inputEl = el} />
                      </div>
                      <div className="control">
                        <div className="button" type="submit">Submit</div>
                      </div>
                    </div>
                    <article className="message">
                      <div className="message-body">
                        <ul>
                          {
                            this.state.messages.map(message => <li key={message.id}>{message.text}</li>)
                          }
                        </ul>
                      </div>
                    </article>
                  </form>

                </div>

              </div>
            </div>

          </div>
        </div >
      </section >
    );
  }
}

export default Game;

