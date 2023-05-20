// Implement Minimax algorithm

import Board from "./Board";
import { SCORES } from "./constants";
import { switchPlayer } from "./utils";

/**
 * The Minimax algorithm is a decision-making algorithm commonly used in game theory and AI. 
 * It works by analyzing a game's decision tree to identify the best move to make in a given situation. 
 * The algorithm does this by considering all possible moves that can be made by both players and assigns a score to each outcome based on how advantageous or disadvantageous it is to the player. 
 * The algorithm then alternates between maximizing and minimizing the score at each level of the decision tree, to identify the move that maximizes the player's chances of winning while minimizing the opponent's chances. 
 * Considering that the number of possible moves in Tic-Tac-Toe is quite small, compared to other games, like chess, the algorithm will not take much time to calculate the best moves.
 */

export const minimax = (
  board: Board,
  player: number
): [number, number | null] => {
  // initialize the multiplier to adjust scores based on the player's perspective
  const multiplier = SCORES[String(player)];
  let thisScore;
  let maxScore = -1;
  let bestMove = null;
  // check if the game is over and return the score and move if so
  const winner = board.getWinner();
  if (winner !== null) {
    return [SCORES[winner], 0]
  } else {
    // loop through each empty square on the board
    for (const square of board.getEmptySquares()) {
      // create a copy of the board and make a move for the current player
      let copy: Board = board.clone();
      copy.makeMove(square, player);
      // recursively call minimax on the resulting board state
      // switching the player and multiplying the resulting score by the multiplier
      thisScore = multiplier * minimax(copy, switchPlayer(player))[0];

      // update the maxScore and bestMove variables if the current move
      // produces a higher score than previous moves
      if (thisScore >= maxScore) {
        maxScore = thisScore;
        bestMove = square;
      }
    }

    // return the best score found, multiplied by the multiplier,
    // and the corresponding best move as a tuple
    return [maxScore * multiplier, bestMove];
  }
};