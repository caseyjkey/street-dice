import React, { Component } from 'react'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

let Stages = [
  "Set Shooter",
  "The Comeout",
  "The Point"
]




class App extends Component {
  constructor(props) {
    super(props);
    let player = Math.round(Math.random());
    this.state = {
      outline: true,
      outlineColor: '#0000000',
      dieSize: 60,
      disableIndividual: true,
      margin: 15,
      numDice: 2,
      sides: 6,
      rollTime: 1,
      faceColor: '#663399',
      dotColor: '#F5BD02',
      best: [-1, -1],
      diceTotal: '...',
      rolling: false,
      rollCount: 0,
      style: {float: 'left', marginRight: '5em'},
      stage: Stages[0],
      player: player,
      message: "Player " + (player + 1) + ", high or low when rolling for Shooter?",
      shooter: null
    }
    this.rollDone = this.rollDone.bind(this);
    this.shooterWins = this.shooterWins.bind(this);
    this.shooterLoses = this.shooterLoses.bind(this);
    this.rollAll = this.rollAll.bind(this);
    this.setShooter = this.setShooter.bind(this);
  }


  setShooter(value) {
    let nextPlayer = this.state.player + 1;
    console.log(value, nextPlayer);
    this.setState({ 
      shooter: value,
      player: nextPlayer,
      message: "Player " + nextPlayer + " roll for best value."
    });
  }

  rollDone(value, values) {
    this.setState({ 
      diceTotal: 3,
      rolling: false, 
      rollCount: this.state.rollCount + 1
    });
    console.log('values', value, values)
    let rollTotal = parseInt(value);

    console.log("diceTotal:", this.state.diceTotal, "rollCount", this.state.rollCount, "rollTotal", rollTotal)
    if (this.state.stage === Stages[0]) {
      let best = this.state.best;
      let message, stage;
      let nextPlayer = this.state.player === 1 ? 2 : 1;
      if (this.state.rollCount === 1 || best[1] === rollTotal) {
        console.log('1', this.state.player, nextPlayer)
        best = [this.state.player, rollTotal];
        message = "Now, Player " + nextPlayer + " roll for best."
        console.log('best1:', best)
        stage = "Set Shooter"
      } else {
        console.log('2', best, "rollTotal", rollTotal)
        best = best[1] > rollTotal ? best : [this.state.player, rollTotal];
        message = "Player " + this.state.player + " rolled " + rollTotal + ". Player " + best[0] + " wins and becomes the shooter.";
        stage = "The Comeout"
      }

      console.log("best", best, "stg", stage, nextPlayer)
      this.setState({
        best: best,
        diceTotal: best[1],
        stage: stage,
        player: nextPlayer,
        message: message
      })
    }

    // Bet

    
    // First roll of the game, after deciding who rolls first
    else if (this.state.stage === "The Comeout") {
      // Shooter wins on The Comeout
      if ( rollTotal === 7 || rollTotal === 11) {
        this.shooterWins();
      } 

      // Shooter loses on The Comeout
      else if ( rollTotal === 2 || rollTotal === 3 || rollTotal === 12) {
        this.shooterLoses();
      } 

      // Point set
      else {
        this.setState({message: "Point is " + rollTotal, stage: rollTotal})
      }
    }

    // Point set for game
    else {
      this.setState({message: "Point is " + this.state.stage});
      // Shooter wins
      if ( rollTotal === this.state.stage ) {
        this.shooterWins();
      }
      // Shooter loses, "7 out"
      else if ( rollTotal === 7 ) {
        this.shooterLoses();
      }
    }
  }

  shooterWins() {
    this.setState({
      message: "Shooter Wins! Take pot, then keep rolling.", 
      rollCount: 0,
      stage: "The Comeout",
    });
  }

  shooterLoses() {
    this.setState({message: "Shooter loses! Pass the dice.", rollCount: 0});

    // If Player 2 lost, return to Player 1
    if(this.state.style['float'] === 'right') {
      this.setState({style: {...this.state.style, 'float': 'left'}});
    }
    // If Shooter loses (Player 1), float the dice to Player 2
    else
      this.setState({style: {...this.state.style, 'float': 'right'}});
  }


  rollAll() {
    this.reactDice.rollAll();
    this.setState({ rolling: true, message: "Rolling..."});
  }
  
  render() {
    

    return (
      <div 
        style={this.state.style}
      >
        <h1>{this.state.message}</h1>
        { this.state.stage === Stages[0] && !this.state.shooter && (
          <React.Fragment>
            <button 
                onClick={() => this.setShooter("High")}
              >
                High
              </button>
              <button 
                onClick={() => this.setShooter("Low")}
              >
                Low
              </button>
          </React.Fragment>
        )}
        { this.state.shooter && (
          <React.Fragment>
            {this.state.best[0] > -1 &&
              <React.Fragment>
                <h4>
                  {this.state.shooter + "est"} roll: {this.state.best[1] + ", by Player " + this.state.best[0]}
                </h4>
                <h4>Roll Count: {this.state.rollCount}</h4>
              </React.Fragment>
            }
            {this.state.diceTotal !== "..." && (
              <React.Fragment>
                <ReactDice
                  {...this.state}
                  rollDone={this.rollDone}
                  ref={dice => this.reactDice = dice}
                  defaultRoll={3}
                />
              </React.Fragment>
            )}
            <button 
              onClick={this.state.diceTotal === "..." ? this.setState({ diceTotal: "" }) : this.rollAll}
              disabled={this.state.rolling}
            >
              {this.state.diceTotal === "..." ? "Okay" : "Roll"}
            </button>
            { // <h4>Player {this.state.player} total: {this.state.diceTotal}</h4> 
            }
          </React.Fragment>
        )}
      </div>
    );
  }
}


export default App;
