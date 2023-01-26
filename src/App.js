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
    roll: false, // Determines roll button text
    rolling: false, // Used to disable roll button
    rollCount: 0, // 0 hides dice (after losing/winning)
    stage: Stages[0],
    player: player,
    message: "High or low when rolling for Shooter?",
    shooter: null, 
    pot: false, // used to show win/lose button
    win: false,
    score: [0, 0] // false if not betting
  });
  let [bets, setBets] = useState({1: false, 2: false}); // dict of totals, each key a list of bets, a bet is a tuple of (player, value)
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
    if (bets[-1][1] && bets[-1][2]) { // both bets in
      setState({
        ...state,
        stage: "The Comeout",
        score: {1: parseInt(bet[1]), 2: parseInt(bet[2])},
        message: "",
        roll: true,
        rollCount: 0,
        player: player,
      })
    } else if (!bets[-1][1] && !bets[-1][2]) { // no betting
      setBets(false);
      setState({
        ...state,
        player: player,
        score: false,
        message: "",
        roll: true,
        rollCount: 0,
        stage: "The Comeout",
      });
    } else { // 0 or 1 bets
      let newBets = bets;
      newBets[player] = state.bet;
      setBets(newBets);

      setState({
        ...state,
        player: player,
      });
    }
  }

  let rollDone = (value, values) => {
    let rollCount = state.rollCount;
    setState({
      ...state, 
      diceTotal: value,
      rolling: false, 
    });

    

    let shooterWins = () => {
      let newScore = state.score;
      if (state.score) { 
        newScore[state.player] += parseInt(newScore[state.player === 1 ? 2 : 1]);
        newScore[state.player === 1 ? 2 : 1] = 0;
      }

      let newBets = bets;
      delete newBets[0];

      // side bets
      if (bets.length) {

      }

      setState({
        ...state,
        rolling: true,
        roll: true,
        pot: true,
        win: true,
        score: newScore,
        message: "Continue...",
        rollCount: state.rollCount + 1,
      });
    }

    let shooterLoses = () => {
      let newScore = state.score;
      if (state.score) {
        newScore[state.player === 1 ? 2 : 1] += parseInt(newScore[state.player]);
        newScore[state.player] = 0;
      }
      setSwitchPlayer(true);
      setState({
        ...state,  
        message: "",
        rolling: false, 
        pot: true,
        score: newScore,
        rollCount: 0,
      });
    }

    let rollTotal = value;

    if (state.stage === Stages[0]) {
      let best = state.best;
      let roll = false;
      let message, stage;
      let nextPlayer = state.player === 1 ? 2 : 1;
      if (state.rollCount === 0 || best[1] === rollTotal) { // 1st roll
        best = [state.player, rollTotal];
        message = "";
        stage = "Set Shooter";
      } else { // 2nd roll
        best = best[1] > rollTotal ? best : [state.player, rollTotal];
        message = "Player " + best[0] + " wins and becomes the shooter.";
        stage = "Bet";
        nextPlayer = best[0];
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
        rollCount: rollCount + 1,
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
          rollCount: state.rollCount + 1,
        })
      }
    }

    // Point set for game
    else {
      setState({
        ...state, 
        message: "Point is " + state.point, 
        rollCount: state.rollCount + 1,
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
      
        <Container className="d-flex justify-content-center">
          <div className="mt-4 d-flex flex-column text-center">
            { (state.shooter && state.best[0] > -1) && 
                <div>
                  {state.stage === "Set Shooter" &&
                    <section>
                      <h1 className="fw-bold">
                        Player {state.player}
                      </h1>
                      <h4>
                        {state.shooter + "est"} roll: {state.best[1] + ", by Player " + state.best[0]}
                      </h4>
                    </section>
                  }
                  {(state.stage === "Bet" || state.stage === "The Point" || state.stage === "The Comeout") && 
                    <div>
                      {state.stage !== "Bet" &&
                        <h1 className="my-4 fw-bold">
                          Shooter
                        </h1>
                      }
                      <h2>
                        Player {state.player}{ state.stage !== "Bet" && // TODO: funnel into top-up pipeline
                          state.score ? (
                            state.score[state.player] < 0 ? `: ($${state.score[state.player]})` : `: $${state.score[state.player]}`
                          ) :
                          ""
                        }
                      </h2>
                    </div>
                  }
                  {state.rollCount > 0 &&
                    <h4>Roll Count: {state.rollCount}</h4>
                  }
                  {state.stage === "Set Shooter" && state.rollCount === 2 && 
                    <h4>Player {state.best[0]}: {state.best[1]}</h4>
                  }
                </div>
            }
            {state.shooter && state.diceTotal !== "..." && (
              <ReactDice
                {...diceOptions}
                className="dice"
                rollDone={rollDone}
                ref={dice => state.reactDice = dice}
                defaultRoll={3}
              />
            )}
            { state.best[0] !== -1 && 
              <div id="rollInfo">
                { state.stageName !== "butter" && <h2>{state.diceTotal}</h2> }
                <h1>{state.message}</h1>
              </div>
            }
          </div>
        </Container>
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
            {state.pot && 
              <Row className="mt-4">
                <Button 
                  color={state.win ? "success" : "danger"}
                  style={{
                    ...rollButtonStyle    
                  }}
                  onClick={ () => {
                    setState({
                      ...state, 
                      pot: false, 
                      win: false,
                      rolling: false,
                      message: "",
                      diceTotal: state.win ? state.diceTotal : "...", // to hide the dice (new roll)
                      roll: true, 
                      stage: "Bet",
                      player: switchPlayer ? (state.player === 1 ? 2 : 1) : state.player,
                    }) 
                  }}
                >
                  { 
                    state.win ? (
                      !bets[state.diceTotal][state.player] ? "Win" : ("$" + (parseInt(bets[state.diceTotal][state.player]) + parseInt(bets[state.diceTotal][state.nextPlayer])))
                    ) : bets === false ? "Pass" : "($" + (parseInt(bets[state.diceTotal][state.player]) + parseInt(bets[state.diceTotal][state.nextPlayer]) + ")")
                  }
                </Button>
              </Row>
            }
            {!state.pot && 
              <Row>
                <Button 
                  color="primary"
                  style={rollButtonStyle}
                  onClick={
                    state.diceTotal === "..." ? 
                      () => setState({...state, diceTotal: "", roll: true }) 
                      : state.stage === "Bet" ? 
                        () => {
                          setState({...state, message: "", roll: true}); 
                          placeBet();
                        } : rollAll
                    }
                  disabled={state.rolling}
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
