import React, { Component } from 'react'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

class App extends Component {
  constructor(props) {
    super(props)
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
      diceTotal: '...',
      rolling: false,
      rollCount: 0,
      style: {float: 'left', marginRight: '5em'},
      stage: "The Comeout", // Either the Comeout or the Point number (2 to 12)
    }
    this.rollDone = this.rollDone.bind(this);
    this.shooterWins = this.shooterWins.bind(this);
    this.shooterLoses = this.shooterLoses.bind(this);
    this.rollAll = this.rollAll.bind(this);
  }

  rollDone(value, values) {
    this.setState({ diceTotal: value, rolling: false, rollCount: this.state.rollCount + 1});

    let rollTotal = parseInt(this.state.diceTotal);

    // First roll of the game, after deciding who rolls first
    // For now, the left side is the Shooter aka Player 1
    if (this.state.stage === "The Comeout") {
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
    this.setState({message: "Shooter Wins! Take pot, then keep rolling.", rollCount: 0});
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
    this.setState({ rolling: true});
  }
  
  render() {
    

    return (
      <div 
        style={this.state.style}
      >
        <h4>Roll {this.state.rollCount}</h4>
        <h1>{this.state.message}</h1>
        <h2>{this.state.stage}</h2>
        <ReactDice
          {...this.state}
          rollDone={this.rollDone}
          ref={dice => this.reactDice = dice}
        />

        <button 
          onClick={this.rollAll}
          disabled={this.state.rolling}
        >
          Roll All
        </button>
        
        <h4>Total: {this.state.diceTotal}</h4>
      </div>
    );
  }
}


export default App;
