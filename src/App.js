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
    }
    this.rollDone = this.rollDone.bind(this);
    this.rollAll = this.rollAll.bind(this);
  }

  rollDone(value, values) {
    this.setState({ diceTotal: value, rolling: false, rollCount: this.state.rollCount + 1});
  }

  rollAll() {
    this.reactDice.rollAll();
    this.setState({ rolling: true});
  }
  
  render() {
    let stage;
    if (this.state.rollCount === 0)
      stage ="The Comeout";
    else {
      let rollTotal = parseInt(this.state.diceTotal);

      if ( rollTotal === 7 || rollTotal === 11) {
        console.log("Shooter wins!");
        stage = "Shooter Wins! Take pot, then keep rolling.";
        this.state.rollCount = 0;
      } else if ( rollTotal === 2 || rollTotal === 3 || rollTotal === 12) {
        console.log("Shooter loses!");
        stage = "Shooter loses! Pass the dice.";
        if(this.state.style['float'] === 'right') {
          this.setState({style: {...this.state.style, 'float': 'left'}});
        }
        else
          this.setState({style: {...this.state.style, 'float': 'right'}});
        this.state.rollCount = 0;
      } else {
        stage = "Point is " + rollTotal;
      }
    }

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
