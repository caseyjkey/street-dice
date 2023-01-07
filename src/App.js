import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Button, Container, Row, Col } from 'reactstrap'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import { useViewport } from './utils/viewport'

let player = Math.round(Math.random()+1);

let Stages = [
  "Set Shooter",
  "Bet",
  "The Comeout",
  "The Point"
]


const App = () => {

  let [state, setState] = useState({
    reactDice: null,
    best: [-1, -1],
    diceTotal: '...',
    roll: false,
    rolling: false,
    rollCount: 0,
    stage: Stages[0],
    player: player,
    message: "High or low when rolling for Shooter?",
    shooter: null
  });

  let setShooter = (value) => {
    let nextPlayer = state.player === 1 ? 2 : 1;
    setState({ 
      ...state,
      shooter: value,
      player: nextPlayer,
      message: "Roll for " + value.toLowerCase() + "est value."
    });
  }

  let rollDone = (value, values) => {
    let rollCount = state.rollCount + 1;
    console.log("1 rollCount", state, rollCount)
    setState({
      ...state, 
      rollCount: rollCount,
      diceTotal: value,
      rolling: false, 
    });
    console.log("2 rollCount", state)


    let bet = () => {
      setState({
        ...state,
        message: "Shooter (Player " + state.shooter + ") make bet.",
        stage: "Bet"
      })
    }

    let shooterWins = () => {
      setState({
        ...state,
        message: "Shooter wins! Take pot, then keep rolling.", 
        stage: "The Comeout",
      });
    }

    let shooterLoses = () => {
      setState({...state, message: "Shooter loses! Pass the dice.", rollCount: 0});

      // If Player 2 lost, return to Player 1
      if(state.style['float'] === 'right') {
        setState({...state, style: {...state.style, 'float': 'left'}});
      }
      // If Shooter loses (Player 1), float the dice to Player 2
      else
        setState({...state, style: {...state.style, 'float': 'right'}});
    }

    let rollTotal = value;

    if (state.stage === Stages[0]) {
      let best = state.best;
      let roll = state.roll;
      let message, stage;
      let nextPlayer = state.player === 1 ? 2 : 1;
      if (rollCount === 1 || best[1] === rollTotal) {
        best = [state.player, rollTotal];
        message = "Now, Player " + nextPlayer + " roll for " + state.shooter.toLowerCase()+ "est."
        stage = "Set Shooter"
      } else {
        best = best[1] > rollTotal ? best : [state.player, rollTotal];
        message = "Player " + state.player + " rolled " + rollTotal + ". Player " + best[0] + " wins and becomes the shooter.";
        stage = "The Comeout";
        nextPlayer = best[0];
        roll = false;
      }

      setState({
        ...state,
        best: best,
        diceTotal: rollTotal,
        stage: stage,
        player: nextPlayer,
        message: message,
        roll: roll,
        rollCount: rollCount,
        rolling: false,
      })
    }
    
    // First roll of the game, after deciding who rolls first
    else if (state.stage === "The Comeout") {
      // Bet



      // Shooter wins on The Comeout
      if ( rollTotal === 7 || rollTotal === 11) {
        shooterWins();
      } 

      // Shooter loses on The Comeout
      else if ( rollTotal === 2 || rollTotal === 3 || rollTotal === 12) {
        shooterLoses();
      } 

      // Point set
      else {
        setState({...state, message: "Point is " + rollTotal, point: rollTotal, stage: "The Point"})
      }
    }

    // Point set for game
    else {
      setState({...state, message: "Point is " + state.point});
      // Shooter wins
      if ( rollTotal === state.point ) {
        shooterWins();
      }
      // Shooter loses, "7 out"
      else if ( rollTotal === 7 ) {
        shooterLoses();
      }
    }
  }

  let rollAll = () => {
    state.reactDice.rollAll();
    setState({...state, rolling: true, message: "Rolling..."});
  }

  const { width } = useViewport();
  const breakpoint = 620;

  const myStyle = {
    display: "flex",
    width: "100%",
    maxWidth: "60%",
    margin: "0 auto",
    justifyContent: "center"
  };

  const highLowButtonStyle = {
    height: width < breakpoint ? "3em" : "5em",
    width: width < breakpoint ? "85vw": "10em",
    margin: width < breakpoint ? "0 0 0em 0" : "0 0 3em 0",
    fontSize: "3em",
    borderRadius: "0.25em"
  }

  const rollButtonStyle = {
    height: '25vh',
    width: width < breakpoint ? '75vw' : '30vw',
    fontSize: '5em',
    borderRadius: '0.25em',
    margin: width < breakpoint ? "0em 0 1em 0" : "0 0 3em 0",
  }

  let diceOptions = {
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
  }

  console.log(state);

  return (
    <Container className="vh-100">
      <Row 
        style={{
          ...state.style,
          justifyContent: "center",
        }}
      >
        <Col>
          <Container>
            {state.best[0] === -1 && 
              <Row>
                <Row>
                  <Col align="center" className="mt-4 text-uppercase">
                    <h1 className="fw-bold">Player {state.player}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col align="center" className="mt-2 mb-4">
                    <h1>{state.message}</h1>
                  </Col>
                </Row>
              </Row>
            }
            { state.stage === Stages[0] && !state.shooter && (
              <Row className="align-items-end" style={{minHeight: "40em"}}>
                <Col align="center">
                  <Button 
                    color="primary"
                    size="lg"
                    style={{
                      ...highLowButtonStyle,
                      margin: width < breakpoint ? "-3em 0 0em 0" : "0 0 3em 0"
                    }}
                    onClick={() => setShooter("High")}
                  >
                    High
                  </Button>
                </Col>
                <Col align="center">
                  <Button 
                    color="primary"
                    size="lg"
                    style={{
                      ...highLowButtonStyle,
                      margin: width < breakpoint ? "-9em 0 1em 0" : "0 0 3em 0"
                    }}
                    onClick={() => setShooter("Low")}
                  >
                    Low
                  </Button>
                </Col>
              </Row>
            )}
            { state.shooter && (
              <Row align="center" className="align-items-end" style={{justifyContent: "center"}}>
                {state.best[0] > -1 &&
                  <Col className="mt-4">
                    <h3>{"Player " + (state.player === 1 ? "2" : "1") + " rolled " + state.diceTotal + "."}</h3>
                    <h4>
                      {state.shooter + "est"} roll: {state.best[1] + ", by Player " + state.best[0]}
                    </h4>
                    <h4>Roll Count: {state.rollCount}</h4>
                  </Col>
                }
                {state.diceTotal !== "..." && (
                  <Row className="align-items-center" style={{minHeight: "20em", margin: "-2em 0"}}>
                    <Col>
                      <ReactDice
                        {...diceOptions}
                        className="dice"
                        rollDone={rollDone}
                        ref={dice => state.reactDice = dice}
                        defaultRoll={3}
                      />
                    </Col>
                  </Row>
                  ) 
                }
                {state.best[0] !== -1 && 
                  <Row>
                    <Col align="center" className="" >
                      <h1 style={{margin: width < breakpoint ? "-2em 0 1.5em 0" : "0 0 0 0"}}>{state.message}</h1>
                    </Col>
                  </Row>
                }
                <Row 
                  className="align-elf-end" 
                  style={{
                    minHeight: state.roll ? "25em" : state.diceTotal !== "..." ? "20em" : "45em",
                  }}
                >
                  <Col>
                    <Button 
                      color="primary"
                      style={rollButtonStyle}
                      className=""
                      onClick={state.diceTotal === "..." ? () => setState({...state, diceTotal: "", roll: true }) : rollAll}
                      disabled={state.rolling}
                    >
                      {state.roll ? "Roll" : "Okay"}
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

export default App;
