import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Button, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import { useViewport } from './utils/viewport'

let player = Math.round(Math.random()+1);

let Stages = [
  "Set Shooter",
  "The Comeout",
  "The Point"
]


const App = () => {

  let [state, setState] = useState({
    reactDice: null,
    best: [-1, -1], // only used for set shooter
    diceTotal: '...', // only used at start (set shooter)
    roll: false,
    rolling: false,
    rollCount: 0,
    stage: Stages[0],
    player: player,
    message: "High or low when rolling for Shooter?",
    shooter: null,
    pot: false,
    score: [0, 0]
  });
  let [bet, setBet] = useState({1: false, 2: false});
  let [switchPlayer, setSwitchPlayer] = useState(false);

  let setShooter = (value) => {
    let nextPlayer = state.player === 1 ? 2 : 1;
    setState({ 
      ...state,
      shooter: value,
      player: nextPlayer,
      message: "Roll for " + value.toLowerCase() + "est value."
    });
  }

  let placeBet = () => {
    let player = state.player === 1 ? 2 : 1;
    console.log(bet);
    if (bet[1] && bet[2]) {
      setState({
        ...state,
        stage: "The Comeout",
        message: "",
        roll: true,
        player: player,
      })
    } else {
      let newBet = bet;
      newBet[player] = state.bet;
      setBet(newBet);
      console.log(newBet, bet)

      setState({
        ...state,
        player: player,
        stage: "Bet",
      });
    }
  }

  let rollDone = (value, values) => {
    let rollCount = state.rollCount + 1;
    setState({
      ...state, 
      rollCount: rollCount,
      diceTotal: value,
      rolling: false, 
    });

    

    let shooterWins = () => {
      let newScore = state.score;
      newScore[state.player === 1 ? 2 : 1] += newScore[state.player];

      setState({
        ...state,
        message: "Shooter wins!", 
        stage: "The Comeout",
        rolling: true,
        roll: true,
        pot: true,
        score: newScore,
      });
    }

    let shooterLoses = () => {
      let newScore = state.score;
      newScore[state.player] += state.pot;
      
      setSwitchPlayer(true);
      setState({
        ...state, 
        message: "Shooter loses!", 
        stage: "The Comeout", 
        player: state.diceTotal === 7 ? state.player === 1 ? 2 : 1 : state.player, 
        rolling: false, 
        pot: true,
        score: newScore,
      });
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
        stage = "Bet";
        nextPlayer = best[0];
        roll = false;
      }

      setSwitchPlayer(false);
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
    else if (state.stage === "Bet") {
      // Bet
      setState({...state, roll: false});
    }
    // First roll of the game, after deciding who rolls first
    else if (state.stage === "The Comeout") {
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
        setState({
          ...state,
          message: "Point is " + rollTotal,
          point: rollTotal,
          stage: "The Point",
          rolling: false,
          roll: true,
        })
      }
    }

    // Point set for game
    else {
      setState({
        ...state, 
        message: "Point is " + state.point, 
        rolling: false, 
        roll: true,
      });
      // Shooter wins
      if ( rollTotal === state.point ) {
        shooterWins();
      }
      // Shooter loses, "7 out"
      else if ( rollTotal === 7 ) {
        shooterLoses();
        setSwitchPlayer(true);
      }
    }
  }

  let rollAll = () => {
    state.reactDice.rollAll();
    setState({...state, rolling: true, message: "Rolling..."});
  }

  const { width } = useViewport();
  const breakpoint = 620;

  const highLowButtonStyle = {
    height: width < breakpoint ? "3em" : "5em",
    width: width < breakpoint ? "85vw": "10em",
    margin: width < breakpoint ? "0 0 0em 0" : "0 0 3em 0",
    fontSize: "3em",
    borderRadius: "0.25em"
  }

  let rollButtonStyle = {
    position: 'absolute',
    height: '2em',
    width: width < breakpoint ? '75vw' : '30vw',
    fontSize: '5em',
    borderRadius: '0.25em',
    bottom: 0,
    margin: width < breakpoint ? "0em auto 1em auto" : "0 auto 1em auto",
    left: 0,
    right: 0,
    textAlign: "center"
  }

  if (width < breakpoint) {
    rollButtonStyle = {
      ...rollButtonStyle,
    }
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
                {(state.stage === "The Point" || state.stage === "The Comeout") && 
                  <h1 className="my-4 fw-bold">Player {state.player}</h1>
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
          {state.stage === "Bet" && 
            <Row>
              <Col align="center">
                <Form style={{
                  position: "absolute",
                  width: "15em",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center"
                }}>
                  <FormGroup>
                    <Label
                      for="bet"
                      hidden
                    >
                      Bet
                    </Label>
                    <Input
                      id="bet"
                      name="bet"
                      placeholder="Bet"
                      type="number"
                      value={state.bet}
                      onChange={(val) => {
                        if (val.target.attributes.id.value !== "bet") return;
                        let player = state.player;
                        let newBet = bet;
                        newBet[player] = val.target.value; 
                        setBet(newBet);
                        setState({...state, bet: val.target.value})
                      }}
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          }
          <Col>
            {state.pot == true && 
              <Row className="mt-4">
                <Button 
                  color="warning"
                  style={{
                    ...rollButtonStyle    
                  }}
                  onClick={ () => setState({
                      ...state, 
                      pot: false, 
                      rolling: false, 
                      roll: true, 
                      player: switchPlayer ? (state.player === 1 ? 2 : 1) : state.player
                    }) 
                  }
                >
                  {!bet[1] ? "Okay" : ("$" + (parseInt(bet[1]) + parseInt(bet[2])))}
                </Button>
              </Row>
            }
            {state.pot !== true && 
              <Row>
                <Button 
                  color="primary"
                  style={rollButtonStyle}
                  onClick={state.diceTotal === "..." ? () => setState({...state, diceTotal: "", roll: true }) : state.stage === "Bet" ? () => {console.log("11111111", state); setState({...state, "message": ""}); placeBet();} : rollAll}
                  disabled={state.rolling || (state.stage === "Bet" && state.bet == false)}
                >
                  {state.roll ? "Roll" : state.stage === "Set Shooter" ? "Okay" : switchPlayer ? "Pass" : ((state.stage === "Bet" && !bet[1] && !bet[2]) ? "No Bet" : ((bet[state.player === 1 ? 2 : 1] ? "Fade" : "Match")))}
                </Button>
              </Row>
            }
          </Col>
        </Container>
      }
    </Container>
  );
}

export default App;
