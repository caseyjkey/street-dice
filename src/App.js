import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Button, Container, Row, Col } from 'reactstrap'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import { useViewport } from './utils/viewport'
import { findByLabelText } from '@testing-library/dom'
import { isAbsolute } from 'path'
import { auto } from '@popperjs/core'
import { FLIPPED_ALIAS_KEYS } from '@babel/types'

let player = Math.round(Math.random()+1);

let Stages = [
  "Set Shooter",
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
    console.log("rollDone")
    let rollCount = state.rollCount + 1;
    setState({
      ...state, 
      rollCount: rollCount,
      diceTotal: value,
      rolling: false, 
    });

    let bet = () => {
      setState({
        ...state,
        message: "Shooter (Player " + state.shooter + ") make bet.",
        stage: "Bet",
      })
    }

    let shooterWins = () => {
      setState({
        ...state,
        message: "Shooter (Player " + state.player + ") wins! Take pot, then keep rolling.", 
        stage: "The Comeout",
        rolling: false,
      });
    }

    let shooterLoses = () => {
      setState({
        ...state, 
        message: "Shooter (Player " + state.player + ") loses! Pass the dice.", 
        stage: "The Comeout", 
        player: state.player === 1 ? 2 : 1, 
        rolling: false, 
      });

      /*
      // If Player 2 lost, return to Player 1
      if(state.style['float'] === 'right') {
        setState({...state, style: {...state.style, 'float': 'left'}, rolling: false, });
      }
      // If Shooter loses (Player 1), float the dice to Player 2
      else
        setState({...state, style: {...state.style, 'float': 'right'}, rolling: false, });
        */
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
        setState({...state, message: "Point is " + rollTotal, point: rollTotal, stage: "The Point", rolling: false,})
      }
    }

    // Point set for game
    else {
      setState({...state, message: "Point is " + state.point, rolling: false, });
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

  let rollButtonStyle = {
    position: 'absolute',
    height: '25vh',
    width: width < breakpoint ? '75vw' : '30vw',
    fontSize: '5em',
    borderRadius: '0.25em',
    margin: width < breakpoint ? "0em auto 1em auto" : "0 0 3em 0",
  }

  if (width < breakpoint) {
    rollButtonStyle['bottom'] = 0;
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
    <Container className="vh-100 flex-fill d-flex flex-column">
      {state.best[0] === -1 && 
        <Row align="center">
          <Col className="col-xs-12 center-block text-center">
            <h1 className="my-4 fw-bold">Player {state.player}</h1>
            <h1 className="my-4">{state.message}</h1>
          </Col>
        </Row>
      }
      { state.stage === Stages[0] && !state.shooter && (
        <Row className="h-50 mt-auto">
          <Col align="center">
            <Button 
              color="primary"
              size="lg"
              style={{
                ...highLowButtonStyle,
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
              }}
              onClick={() => setShooter("Low")}
            >
              Low
            </Button>
          </Col>
        </Row>
      )}
      {state.diceTotal !== "..." && (
        <Container className="d-flex justify-content-center">
          <div className="mt-4 d-flex flex-column text-center">
            { (state.shooter && state.best[0] > -1) && 
              <div>
                {state.stage === "Set Shooter" &&
                  <h4>
                    {state.shooter + "est"} roll: {state.best[1] + ", by Player " + state.best[0]}
                  </h4>
                }
                <h4>Roll Count: {state.rollCount}</h4>
              </div>
            }
            <ReactDice
              {...diceOptions}
              className="dice"
              rollDone={rollDone}
              ref={dice => state.reactDice = dice}
              defaultRoll={3}
            />
            { state.best[0] !== -1 && 
              <h1>{state.message}</h1>
            }
          </div>
        </Container>
      )}
      {state.shooter && 
        <Container className="h-100 d-flex justify-content-center">
          <Button 
            color="primary"
            style={rollButtonStyle}
            onClick={state.diceTotal === "..." ? () => setState({...state, diceTotal: "", roll: true }) : rollAll}
            disabled={state.rolling}
          >
            {state.roll ? "Roll" : "Okay"}
          </Button>
        </Container>
      }
    </Container>
  );
}

export default App;
