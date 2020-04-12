import React from 'react';
import fire from '../fire';
import 'bulma';
// import './app.scss'
import firebase from 'firebase';
import { Redirect, Link } from 'react-router-dom';

function Navbar(props) {
  return (
    <header className="navbar">

      <div className="navbar-brand">
        <div className="title">tictactoe</div>
      </div>

      <div className='navbar-menu'>
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

    </header>
  );
}

function Square(props) {
  return (
    <button className="button" onClick={() => props.onClick()}> {props.value} </button>
  );
}

function extractSquares(moves, startX){
  let squares=Array(9).fill(null);
  for(var i=1; i<moves.length; i++){
    squares[i]=((i+startX)%2===0?'X':'O');
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
      return squares[a];
    }
  }
  return null;
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
          <td>{this.renderSquare(4)}</td>
          <td>{this.renderSquare(5)}</td>
          <td>{this.renderSquare(3)}</td>
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
      moves: '',
      step: 0,
      xNext: true,
      matchFooter: '',
      player1: '',
      player2: '',
      gameState: 0,
      invFrom: '',
      invited: '',
      gamedir: '',
      startX: 1
    };
  }

  async checkGameStatus() {

    await firebase.database().ref('/users/' + fire.auth().currentUser.uid).once('value')
      .then((snapshot) => {
        this.setState({ player1: snapshot.val().username });
      })
      .catch((error) => {
        alert(error.message);
      });

    firebase.database().ref('/session/' + this.state.player1 + '/game/').on('value', (snapshot) => {
      if (snapshot.val().player2 !== null && snapshot.val().player2 !== 'none') {
        this.setState({
          matchFooter: <p>{'Playing against ' + snapshot.val().player2 + ', You play Xs'}</p>,
          gamedir: '/session/' + this.state.player1 + '/game/',
          player2: snapshot.val().player2,
          gameState: 1,
          moves: snapshot.val().moves,
          startX: 1
        });
        setTimeout(() => { this.setState({ matchFooter: '' }); }, 5000);
      } else {
        firebase.database().ref('/session/' + this.state.player1 + '/invFrom').on('value', (snapshot) => {
          if (snapshot.val() !== null && snapshot.val() !== 'none') {
            const invitationButton =
              <div>
                <p>Invitation from {snapshot.val()}</p>
                <div className="buttons">
                  <button className="button is-dark" onClick={() => this.acceptInvitation(snapshot.val())}>Accept Invitation</button>
                  <button className="button" onClick={() => this.cancelInvitation()}>Cancel</button>
                </div>
              </div>;
            this.setState({
              matchFooter: invitationButton,
              xNext: false,
              startX: 0
            });
          }
        });
      }
    });
  }

  componentDidMount() {
    this.checkGameStatus();
    // game
    // firebase.database().ref(/).on('value', snapshot => {
    //   if (snapshot.val() !== null || snapshot.val() !== "none") {
    //     this.setState({
    //       matchFooter: <div className="notification">{<p>{this.state.player2} has accepted your invitation</p>}</div>
    //     });
    //     setTimeout(() => this.setState({ matchFooter: "" }), 5000);
    //   }
    // });
  }

  acceptInvitation(player2) {
    this.setState({
      matchFooter: 'You play Os',
      player2: player2,
      gameState: 1,
      gamedir: 'session/' + player2 + '/game/'
    });
    firebase.database().ref('/session/' + player2 + '/').update({
      game: {
        moves: [-1],
        player2: this.state.player1
      },
      playing: 1
    });
    firebase.database().ref('/session/' + this.state.player1 + '/').update({
      playing: 1
    });
  }

  cancelInvitation() {
    this.setState({ matchFooter: '' });
    firebase.database().ref('/session/' + this.state.player1 + '/invFrom').set("none").then(() => console.log('Invitation cleared'));
  }

  componentWillMount() {
    // let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    // messagesRef.on('child_added', snapshot => {
    //   /* Update React state when message is added at Firebase Database */
    //   let message = { text: snapshot.val(), id: snapshot.key };
    //   this.setState({ messages: [message].concat(this.state.messages) });
    // })
    ;
  }

  inviteFriend() {
    // e.preventDefault()
    let database = firebase.database();
    database.ref('session/' + this.state.player2).update({
      invFrom: this.state.player1
    });
    console.log('Invited player2');

    this.setState({ matchFooter: "Invitation sent to " + this.state.player2 });
    setTimeout(() => {
      this.setState({ matchFooter: "" });
    }, 3000);
  }

  startGame() {
    ;
  }

  logout() {
    firebase.auth().signOut().then(function () {
      console.log('logged out');
      return <Redirect to='/login' />;
    });
  }

  handleClick(i) {
    this.setState({
      moves: this.state.moves+String(i)
    })
    firebase.database().ref(this.state.gamedir).update({
      moves: this.state.moves
    });
    // const history = this.state.history.slice(0, this.state.step + 1);
    // const current = history[history.length - 1];
    // const squares = current.squares.slice();
    let squares=extractSquares(this.state.moves, this.state.startX);
    if (calculateWinner(squares) || squares[i]) {
      this.setState({ matchFooter: <p>Won!!</p> });
      // return;
    }
  //   squares[i] = this.state.xNext ? 'X' : 'O';
  //   this.setState({
  //     history: history.concat([{
  //       squares: squares
  //     }]),
  //     step: history.length,
  //     xNext: !this.state.xNext
  //   });
  }

  jumpTo(move) {
    this.setState({
      step: move,
      xNext: (move % 2) === 0
    });
  }

  addMessage(e) {
    e.preventDefault();
    fire.database().ref('messages').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input
  }

  render() {

    
    let squares=extractSquares(this.state.moves, this.state.startX);
    const winner = calculateWinner(squares);
    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //     'Go to move #' + move :
    //     'Go to game start';
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   );
    // });

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
    }

    this.state.messages.map(message => <li key={message.id}>{message.text}</li>);

    return (
      <section className="hero is-fullheight is-dark">
        <div className="hero-head">
          <Navbar onClick={() => this.logout()} />
        </div>
        <div className="hero-body">
          <div className="container">

            <h1 className="title">Let's play!</h1>

            <div className="columns">

              <div className="column">
                {/*  coloumn 1 ----------------------------------------------------------*/}
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
                {/* <button className="button">Find an opponent</button> */}

                {/* <div className={this.state.gameState === 1 ? "" : "is-hidden"}> */}
                {/* <div className="is-hidden">
                  <div>{status}</div>
                  <ol>{moves}</ol>
                </div> */}
              </div>

              <div className="column">
                {/*  coloumn 2 ----------------------------------------------------------*/}
                <div className="card">

                  <div className="has-text-centered">
                    {this.state.player1} <span className="tag">VS</span> {this.state.player2}
                  </div>

                  <div className="card-content">
                    <div className="game">
                      <div className="game-board">
                        <Board squares={squares} onClick={(i) => this.handleClick(i)} />
                        {/* <Boardtable /> */}
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

              <div className="column">
                {/*  coloumn 3 ----------------------------------------------------------*/}
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
        </div >
      </section >
    );
  }
}

export default Game;

