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
      rollTime: 2,
      faceColor: '#FF00AC',
      dotColor: '#1eff00',
      diceTotal: '...',
      rolling: false,
      rollCount: 0,
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
    let style;
    if(this.state.rollCount === 1) {
      style = {float: 'right'}
    }
    return (
      <div style={style}>
        <h4>Roll {this.state.rollCount}</h4>
        <ReactDice
          {...this.state}
          rollDone={this.rollDone}
          ref={dice => this.reactDice = dice}
        />

        <button onClick={this.rollAll}>
          Roll All
        </button>
        
        <h4>Total: {this.state.diceTotal}</h4>
      </div>
    );
  }
}


export default App;
