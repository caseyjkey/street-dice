import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Button, Container, Row, Col } from 'reactstrap'
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
    let player = Math.round(Math.random()+1);
    this.state = {
      outline: true,
      outlineColor: '#0000000',
      dieSize: '120',
      disableIndividual: true,
      margin: 15,
      numDice: 2,
      sides: 6,
      rollTime: 1,
      faceColor: 'useCss',
      dotColor: 'useCss',
      best: [-1, -1],
      diceTotal: '...',
      roll: false,
      rolling: false,
      rollCount: 0,
      stage: Stages[0],
      player: player,
      message: "High or low when rolling for Shooter?",
      shooter: null
    }
    this.rollDone = this.rollDone.bind(this);
    this.shooterWins = this.shooterWins.bind(this);
    this.shooterLoses = this.shooterLoses.bind(this);
    this.rollAll = this.rollAll.bind(this);
    this.setShooter = this.setShooter.bind(this);
  }


  setShooter(value) {
    let nextPlayer = this.state.player === 1 ? 2 : 1;
    this.setState({ 
      shooter: value,
      player: nextPlayer,
      message: "Roll for " + value.toLowerCase() + "est value."
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
      let roll = this.state.roll;
      let message, stage;
      let nextPlayer = this.state.player === 1 ? 2 : 1;
      if (this.state.rollCount === 1 || best[1] === rollTotal) {
        console.log('1', this.state.player, nextPlayer)
        best = [this.state.player, rollTotal];
        message = "Now, Player " + nextPlayer + " roll for " + this.state.shooter.toLowerCase()+ "est."
        console.log('best1:', best)
        stage = "Set Shooter"
      } else {
        console.log('2', best, "rollTotal", rollTotal)
        best = best[1] > rollTotal ? best : [this.state.player, rollTotal];
        message = "Player " + this.state.player + " rolled " + rollTotal + ". Player " + best[0] + " wins and becomes the shooter.";
        stage = "The Comeout";
        nextPlayer = best[0];
        roll = false;
      }

      console.log({
        best: best,
        diceTotal: best[0] > -1 ? best[1] : "...",
        stage: stage,
        player: nextPlayer,
        message: message,
        roll: roll
      })
      this.setState({
        best: best,
        diceTotal: best[0] > -1 ? best[1] : "...",
        stage: stage,
        player: nextPlayer,
        message: message,
        roll: roll
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
      message: "Shooter wins! Take pot, then keep rolling.", 
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

    const myStyle = {
      display: "flex",
      width: "100%",
      maxWidth: "60%",
      margin: "0 auto",
      justifyContent: "center"
    };

    const highLowButtonStyle = {
      height: "50vh",
      width: "40vw",
      fontSize: "3em",
      borderRadius: "0.25em"
    }

    const rollButtonStyle = {
      height: '25vh',
      width: '75vw',
      fontSize: '5em',
      borderRadius: '0.25em'
    }

    return (
      <Container>
        <Row 
          style={this.state.style}
        >
          <Col>
            <Container>
              {this.state.best[0] === -1 && 
                <Row>
                  <Row>
                    <Col align="center" className="mt-4 text-uppercase">
                      <h1 className="fw-bold">Player {this.state.player}</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center" className="mt-2 mb-4">
                      <h1>{this.state.message}</h1>
                    </Col>
                  </Row>
                </Row>
              }
              { this.state.stage === Stages[0] && !this.state.shooter && (
                <Row className="align-items-end" style={{minHeight: "40em"}}>
                  <Col align="center">
                    <Button 
                      color="primary"
                      size="lg"
                      style={highLowButtonStyle}
                      onClick={() => this.setShooter("High")}
                    >
                      High
                    </Button>
                  </Col>
                  <Col align="center">
                    <Button 
                      color="primary"
                      size="lg"
                      style={highLowButtonStyle}
                      onClick={() => this.setShooter("Low")}
                    >
                      Low
                    </Button>
                  </Col>
                </Row>
              )}
              { this.state.shooter && (
                <Row align="center" className="align-items-end">
                  {this.state.best[0] > -1 &&
                    <Col className="mt-4">
                      <h3>{"Player " + (this.state.player === 1 ? "2" : "1") + " rolled " + this.state.diceTotal + "."}</h3>
                      <h4>
                        {this.state.shooter + "est"} roll: {this.state.best[1] + ", by Player " + this.state.best[0]}
                      </h4>
                      <h4>Roll Count: {this.state.rollCount}</h4>
                    </Col>
                  }
                  {this.state.diceTotal !== "..." && (
                    <Row className="align-items-center" style={{minHeight: "20em"}}>
                      <Col>
                        <ReactDice
                          {...this.state}
                          className="dice"
                          rollDone={this.rollDone}
                          ref={dice => this.reactDice = dice}
                          defaultRoll={3}
                        />
                      </Col>
                    </Row>
                    ) 
                  }
                  {this.state.best[0] !== -1 && 
                    <Row>
                      <Col align="center" className="">
                        <h1>{this.state.message}</h1>
                      </Col>
                    </Row>
                  }
                  <Row className="align-items-end" style={{minHeight: this.state.roll ? "25em" : this.state.diceTotal !== "..." ? "20em" : "45em"}}>
                    <Col>
                      <Button 
                        color="primary"
                        style={rollButtonStyle}
                        className=""
                        onClick={this.state.diceTotal === "..." ? () => this.setState({ diceTotal: "", roll: true }) : this.rollAll}
                        disabled={this.state.rolling}
                      >
                        {this.state.roll ? "Roll" : "Okay"}
                      </Button>
                    </Col>
                  </Row>
                </Row>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}


export default App;
