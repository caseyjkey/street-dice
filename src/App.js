import React, { Component } from 'react'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      outline: false,
      outlineColor: '#0000000',
      dieSize: 60,
      disableIndividual: true,
      margin: 15,
      numDice: 2,
      sides: 6,
      rollTime: 1,
      faceColor: '#FF00AC',
      dotColor: '#1eff00',
      diceTotal: '...',
      rolling: false,
      rollCount: 0,
      style: {float: 'left', marginRight: '5em'},
      stage: "The Comeout",
    }
    this.rollDone = this.rollDone.bind(this);
    this.rollAll = this.rollAll.bind(this);
  }

  rollDone(value, values) {
    this.setState({ diceTotal: value, rolling: false, rollCount: this.state.rollCount + 1});

    let rollTotal = parseInt(this.state.diceTotal);

    // First roll of the game, after deciding who rolls first
    // For now, the left side is the Shooter aka Player 1
    if (this.state.stage === "The Comeout") {
      // Shooter wins
      if ( rollTotal === 7 || rollTotal === 11) {
        this.setState({message: "Shooter Wins! Take pot, then keep rolling."});
        this.state.rollCount = 0;
      } 
      // Shooter loses
      else if ( rollTotal === 2 || rollTotal === 3 || rollTotal === 12) {
        message = "Shooter loses! Pass the dice.";
        // If Player 2 lost, return to Player 1
        if(this.state.style['float'] === 'right') {
          this.setState({style: {...this.state.style, 'float': 'left'}});
        }
        // If Shooter loses (Player 1), float the dice to Player 2
        else
          this.setState({style: {...this.state.style, 'float': 'right'}});
        this.state.stage = "The Comeout";
      } 
      // Point set
      else {
        stage = "Point is " + rollTotal;
      }
    } 
    // Point set for game
    else {

    }
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
        <h1>{stage}</h1>
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
