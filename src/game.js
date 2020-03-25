import React from 'react';
import fire from './fire';
import { Card } from 'bulma';

function Square(props) {
  return (
    <button class="button" onClick={() => props.onClick()}> {props.value} </button>
  );
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
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      history: [{
        squares: Array(9).fill(null)
      }],
      auth: 0,
      step: 0,
      xNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      step: history.length,
      xNext: !this.state.xNext
    });
  }

  jumpTo(move) {
    this.setState({
      step: move,
      xNext: (move % 2) === 0
    });
  }
  
  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  addMessage(e) {
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.step];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
    }

    this.state.messages.map(message => <li key={message.id}>{message.text}</li>);
    var visibility = '';

    if (this.auth === 1) {
      visibility = "hero is-hidden";
    } else {
      visibility = "hero";
    }

    const game =
      <section class={visibility}>
        <div class="hero-body">
          <div class="container">

            <h1 class="title">Let's play!</h1>

            <div class="columns">

              <div class="column">
                <div className="game-info">
                  <div>{status}</div>
                  <ol>{moves}</ol>
                </div>
              </div>

              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <div className="game">
                      <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column">
                <form onSubmit={this.addMessage.bind(this)}>
                  <div class="field is-grouped">
                    <div class="control is-expanded">
                      <input class="input" placeholder="type message" ref={el => this.inputEl = el} />
                    </div>
                    <div class="control">
                      <div class="button" type="submit">Submit</div>
                    </div>
                  </div>
                  <article class="message">
                    <div class="message-body">
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

    return (
      <game />
    );
  }
}

export default Game;

