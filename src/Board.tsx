import { DIMENSIONS, DRAW } from "./constants";
 
type Grid = Array<null | number>;
export default class Board {
  grid: Grid;
  winningIndex: null | number;
  constructor(grid?: Grid) {
    this.grid = grid || new Array(DIMENSIONS ** 2).fill(null);

    this.winningIndex = null; // track the index of the winning combination
  }
 
  // Collect indices of the empty squares and return them
  getEmptySquares = (grid = this.grid) => {
    let squares: number[] = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };
 
  isEmpty = (grid = this.grid) => {
    return this.getEmptySquares(grid).length === DIMENSIONS ** 2;
  };

  makeMove = (square: number, player: number) => {
    if (this.grid[square] === null) {
      this.grid[square] = player;
    }
  };
 
  getWinner = (grid = this.grid) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let res: number | null = null;
    winningCombos.forEach((el, i) => {
      if (
        grid[el[0]] !== null &&
        grid[el[0]] === grid[el[1]] &&
        grid[el[0]] === grid[el[2]]
      ) {
        res = grid[el[0]];
        this.winningIndex = i;
      } else if (res === null && this.getEmptySquares(grid).length === 0) {
        res = DRAW;
        this.winningIndex = null;
      }
    });
    return res;
  };
 
  clone = () => {
    return new Board(this.grid.concat());
  };

  /**
   * Get the styles for strike-through based on the combination that won
   */
  getStrikethroughStyles = () => {
    const defaultWidth = 285;
    const diagonalWidth = 400;
    switch (this.winningIndex) {
      case 0:
        return `
          transform: none;
          top: 41px;
          left: 15px;
          width: ${defaultWidth}px;
        `;
      case 1:
        return `
          transform: none;
          top: 140px;
          left: 15px;
          width: ${defaultWidth}px;
        `;
      case 2:
        return `
          transform: none;
          top: 242px;
          left: 15px;
          width: ${defaultWidth}px;
        `;
      case 3:
        return `
          transform: rotate(90deg);
          top: 145px;
          left: -86px;
          width: ${defaultWidth}px;
        `;
      case 4:
        return `
          transform: rotate(90deg);
          top: 145px;
          left: 15px;
          width: ${defaultWidth}px;
        `;
      case 5:
        return `
          transform: rotate(90deg);
          top: 145px;
          left: 115px;
          width: ${defaultWidth}px;
        `;
      case 6:
        return `
          transform: rotate(45deg);
          top: 145px;
          left: -44px;
          width: ${diagonalWidth}px;
        `;
      case 7:
        return `
          transform: rotate(-45deg);
          top: 145px;
          left: -46px;
          width: ${diagonalWidth}px;
        `;
      default:
        return null;
    }
  };
}

// import { DIMENSIONS, DRAW } from "./constants";

// type Grid = Array<null | number>;

// const getEmptySquares = (grid: Grid): number[] => {
//   let squares: number[] = [];
//   grid.forEach((square, i) => {
//     if (square === null) squares.push(i);
//   });
//   return squares;
// };

// const isEmpty = (grid: Grid): boolean => {
//   return getEmptySquares(grid).length === DIMENSIONS ** 2;
// };

// const getWinner = (grid: Grid) => {
//   const winningCombos: number[][] = [
//     [0, 1, 2], // top row
//     [3, 4, 5], // middle row
//     [6, 7, 8], // bottom row
//     [0, 3, 6], // left column
//     [1, 4, 7], // middle column
//     [2, 5, 8], // right column
//     [0, 4, 8], // top left to bottom right diagonal
//     [2, 4, 6], // top right to bottom left diagonal
//   ];
//   let res: number | null = null;
//   winningCombos.forEach((el) => {
//     if (
//       grid[el[0]] !== null &&
//       grid[el[0]] === grid[el[1]] &&
//       grid[el[0]] === grid[el[2]]
//     ) {
//       res = grid[el[0]];
//     } else if (res === null && getEmptySquares(grid).length === 0) {
//       res = DRAW;
//     }
//   });
//   return res;
// };

// const cloneBoard = (board: Grid): Grid => {
//   return board.slice();
// };

// class Board {
//   grid: Grid;

//   constructor(grid?: Grid) {
//     this.grid = grid || new Array(DIMENSIONS ** 2).fill(null);
//   }

//   getEmptySquares = (): number[] => {
//     return getEmptySquares(this.grid);
//   };

//   isEmpty = (): boolean => {
//     return isEmpty(this.grid);
//   };

//   getWinner = (): number | null => {
//     return getWinner(this.grid);
//   };

//   clone = (): Board => {
//     return new Board(cloneBoard(this.grid));
//   };
// }

// export default Board;
