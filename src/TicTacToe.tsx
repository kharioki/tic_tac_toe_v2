import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMS, GAME_STATES, DRAW, GAME_MODES } from './constants';
import { getRandomInt, switchPlayer } from './utils';
import Board from './Board';
import { minimax } from './minimax';

const board = new Board();

/** first create an array of length 9, then fill it with null values
 *  we declare it outside the component so its not re-created on every render
 * instead of creating a multidimensional array and then recursively mapping it, we render it as one-dimensional and limit its width with css
 * i.e width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`}
 * width: ${(props) => `${props.dims * (SQUARE_DIMS + 5)}px`} - limit container width to 3 squares of 100pixels each + 5px border and set flex-flow: wrap
 * this pushes the squares to the next line when they reach the container width - thus creating a 3 x 3 grid
 */

const emptyGrid = new Array(DIMENSIONS ** 2).fill(null); // [null, null, null, null, null, null, null, null, null]

export default function TicTacToe() {
  const [grid, setGrid] = useState(emptyGrid);
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
  });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [nextMove, setNextMove] = useState<null | number>(null);

  const [winner, setWinner] = useState<null | string>(null);
  const [mode, setMode] = useState(GAME_MODES.medium);

  // memoize the move function so it doesn't get re-created on every render unless the dependencies change
  const move = useCallback(
    (index: number, player: number | null) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid((grid) => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    }, 
  [gameState]
  );

  
  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
    }
  };

  

  const choosePlayer = (option: number) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    // Set the Player_X to make the first move
    setNextMove(PLAYER_X);
  };

  useEffect(() => {
    const boardWinner = board.getWinner(grid);
    const declareWinner = (winner: number) => {
      let winnerString = '';
      switch (winner) {
        case PLAYER_X:
          winnerString = 'Player X wins!';
          break;
        case PLAYER_O:
          winnerString = 'Player O wins!';
          break;
        case DRAW:
          default:
            winnerString = 'Its a draw!';
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerString);
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [grid, gameState, nextMove]);

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(emptyGrid);
  };

  // we wrap the aiMove function in a useCallback hook so it doesn't get re-created on every render unless the dependencies change
   /**
   * Make the AI move. If it's the first move (the board is empty),
   * make the move at any random cell to skip unnecessary Minimax calculations
   */
   const aiMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat()); // create a copy of the grid
    const emptyIndices = board.getEmptySquares(grid); // get the empty squares
    let index;

    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      // Medium level is approx. half of the moves are minimax and the other half are random
      case GAME_MODES.medium:
        const smartMove = !board.isEmpty() && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.ai!)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.hard:
        default:
          index = board.isEmpty()
            ? getRandomInt(0, 8)
            : minimax(board, players.ai!)[1];
    }

    if (index && !grid[index]) {
      if (players.ai !== null) {
        move(index, players.ai);
      }
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (
      nextMove !== null &&
      nextMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      // Delay AI moves to make them seem natural
      timeout = setTimeout(() => {
        aiMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, aiMove, players.ai, gameState]);

  switch (gameState) {
    case GAME_STATES.notStarted:
      default:
        return (
          <div>
            <Inner>
              <p>Choose game difficulty</p>
              <select onChange={changeMode} value={mode}>
                {Object.keys(GAME_MODES).map((key) => {
                  const gameMode = GAME_MODES[key];
                  return (
                    <option key={gameMode} value={gameMode}>
                      {key}
                    </option>
                  );
                })};
              </select>
            </Inner>
            <Inner>
              <p>Choose your player</p>
              <ButtonRow>
                <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
                <p>or</p>
                <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
              </ButtonRow>
            </Inner>
          </div>
        );
    case GAME_STATES.inProgress:
      return (
        <Container dims={DIMENSIONS}>
          {grid.map((value, index) => {
            const isActive = value !== null;
            
            return (
              <Square key={index} onClick={() => humanMove(index)}>
                {isActive && <Marker>{value === PLAYER_X ? 'X' : 'O'}</Marker>}
              </Square>
            );
          })}
        </Container>
      );
    case GAME_STATES.over:
      return (
        <div>
          <p>{winner}</p>
          <button onClick={startNewGame}>Start over</button>
        </div>
      );
    
  }
}

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;
 
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Container = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;
 
const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  border: 1px solid black;
 
  &:hover {
    cursor: pointer;
  }
`;
 
const Marker = styled.p`
  font-size: 68px;
`;