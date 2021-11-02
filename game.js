const $ = (x) => document.querySelector(x);
const $$ = (x) => document.querySelectorAll(x);

const Player = (name, teamSymbol) => {
    let score = 0;
    const getName = () => name;
    const getTeamSymbol = () => teamSymbol;
    const getScore = () => score;
    const incrementScore = () => { 
        score++;
    }
    const play = (x, y, gameBoard) => {
        if (gameBoard.getCell(x, y) === "") {
            gameBoard.setCell(x, y, teamSymbol)
            gameBoard.updateCellDisplay(x, y, teamSymbol);
            gameBoard.nextTurn();
        } else {
            console.log(`This cell is already taken. Choose another.`);
        }
    };

    return {getName, getTeamSymbol, getScore, incrementScore, play}
}

const gameBoard = (() => {
    'use strict';
    const xMax = 3;
    const yMax = 3;
    let playerTurn = true; // first player's turn
    let board = new Array(xMax).fill().map(() => Array(yMax).fill(""));
    const getCell = (x, y) => {
        if (x < xMax && y < yMax) {
            return board[x][y];
        }
    }
    const getTurn = () => { return playerTurn };
    const nextTurn = () => { playerTurn = !playerTurn };
    const setCell = (x, y, value) => {
        if (x < xMax && y < yMax && typeof(value) === "string") {
            board[x][y] = value;
        } else {
            console.log(`Invalid cell value: cannot set cell ${x},${y} to ${value}`);
        }
    };

    const updateCellDisplay = (x, y, value) => {
        let cell = $(`#board tr[data-row="${x}"] td[data-col="${y}"]`);
        cell.textContent = value;
    };
        
    const eraseCell = (x, y) => {
        if (x < xMax && y < yMax) {
                board[x][y] = "";
        }
    };

    return {board, getTurn, nextTurn, getCell, setCell, updateCellDisplay, eraseCell};
})();

// Game State and Events
const player1 = Player("one", "X");
const player2 = Player("two", "O");
const players = [player1, player2];

const displayCells = $$("#board .ttt-cell");
displayCells.forEach(cell => {
  cell.addEventListener("click", (event) => {
    if (gameBoard.getTurn()) {
      player1.play(cell.parentElement.dataset.row, cell.dataset.col, gameBoard);
    } else {
      player2.play(cell.parentElement.dataset.row, cell.dataset.col, gameBoard);
    }
  });
});

