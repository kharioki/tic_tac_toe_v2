import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMS, GAME_STATES } from './constants';
import { getRandomInt, switchPlayer } from './utils';

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

  // we wrap the aiMove function in a useCallback hook so it doesn't get re-created on every render unless the dependencies change
  const aiMove = useCallback(() => {
    let index = getRandomInt(0, grid.length - 1); // 0 - 8
    while (grid[index]) {
      index = getRandomInt(0, grid.length - 1);
    }
    move(index, players.ai);
    setNextMove(players.human);
  }, [move, grid, players]);

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
    }
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

  const choosePlayer = (option: number) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    // Set the Player_X to make the first move
    setNextMove(PLAYER_X);
  };

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <Inner>
        <p>Choose your player</p>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
      </Inner>
    </div>
  ) : (
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