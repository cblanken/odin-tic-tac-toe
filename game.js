const $ = (x) => document.querySelector(x);
const $$ = (x) => document.querySelectorAll(x);

const Player = (name, teamSymbol) => {
    let score = 0;
    const getName = () => name;
    const getTeamSymbol = () => teamSymbol;
    const setTeamSymbol = (x) => teamSymbol = x;
    const getScore = () => score;
    const incrementScore = () => { 
        score++;
    }
    const play = (x, y, gameBoard) => {
        if (gameBoard.getLockStatus() === true) {
            console.log(`The game is over please restart the game.`);
            return;
        } 
        if (gameBoard.getCell(x, y) === "") {
            gameBoard.setCell(x, y, teamSymbol)
            gameBoard.updateCellDisplay(x, y, teamSymbol);
            gameBoard.nextTurn();
            if (gameBoard.checkForWinner()) {
                console.log(`GAME OVER Player ${name} WINS!`);
                gameBoard.lock();
            }
            if (gameBoard.checkForTie()) {
                console.log(`GAME OVER! IT WAS A TIE!`);
            }
        } else {
            console.log(`This cell is already taken. Choose another.`);
        }
    };

    return {getName, getTeamSymbol, setTeamSymbol, getScore, incrementScore, play}
}

const gameBoard = (() => {
    'use strict';
    const maxRow = 3;
    const maxCol = 3;
    let playerTurn = true; // first player's turn
    let board = new Array(maxCol).fill().map(() => Array(maxRow).fill(""));
    let winningPattern = [];
    let isLocked = false;
    const getCell = (x, y) => {
        if (x < maxRow && y < maxCol) {
            return board[x][y];
        }
    }
    const getTurn = () => { return playerTurn };
    const nextTurn = () => { playerTurn = !playerTurn };
    const setCell = (x, y, value) => {
        if (x < maxRow && y < maxCol && typeof(value) === "string") {
            board[x][y] = value;
        } else {
            console.log(`Invalid cell value: cannot set cell ${x},${y} to ${value}`);
        }
    };

    const unlock = () => {
        isLocked = false;
    }

    const lock = () => {
        isLocked = true;     
    }

    const getLockStatus = () => {
        return isLocked;
    }

    const updateCellDisplay = (x, y, value) => {
        if (isLocked === false) {
            let cell = $(`#board tr[data-row="${x}"] td[data-col="${y}"]`);
            cell.textContent = value;
        }
    };
        
    const eraseCell = (x, y) => {
        if (x < maxRow && y < maxCol && isLocked === false) {
            board[x][y] = "";
            updateCellDisplay(x, y);
        }
    };

    const resetBoard = () => {
        unlock();
        board.forEach((row, yIndex) => {
            row.forEach((col, xIndex) => {
                eraseCell(yIndex, xIndex);
            });
        });
        winningPattern = [];
        isLocked = false;
        playerTurn = true;
    }

    const checkForWinner = () => {
        let isWinner = false;
        // Check rows
        board.forEach((row, index) => {
            // Skip row if winning state already found or
            // any row starting with an empty cell
            let firstCell = row[0];
            if (firstCell === "" || isWinner) return;

            // Winner if every cell in pattern matches
            isWinner = row.every(cell => cell === firstCell);
        });
        
        // Check columns
        for (let col = 0; col < board[0].length; col++) {
            // Skip column if it starts with an empty cell
            const firstCell = board[0][col];
            if (firstCell === "") continue;
            
            for (let row = 1; row < board.length; row++) {
                const cell = board[row][col];     
                if (cell !== firstCell) {
                    break; // move on to next column
                } else if (row === board.length - 1) {
                    isWinner = true;
                }
            }
        }
    
        // Check diagonals
        if (board.length === board[0].length) {
            const topLeft = board[0][0];
            const topRight = board[0][board.length - 1];
            // Top-left to bottom-right diagonal
            for (let row = 0; row < board.length; row++) {
                let col = row;
                // Skip column if it starts with an empty cell
                if (topLeft === "") break;

                if (board[row][col] !== topLeft) {
                    break; // move on to next diagonal
                } else if (row === board.length - 1) {
                    isWinner = true;
                }
            }
            
            // Top-right to bottom-left diagonal
            for (let row = 0; row < board.length; row++) {
                let col = board.length - row - 1;
                // Skip column if it starts with an empty cell
                if (topRight === "") break;

                if (board[row][col] !== topRight) {
                    break;
                } else if (row === board.length - 1) {
                    isWinner = true;
                }
            }
        } else {
            console.log("Board is not square. No diagonals to check.");
        }

        if (isWinner) {
            return true;
        } else {
            return false; // No winner yet
        }
    }

    const checkForTie = () => {
        let emptyCells = [];
        board.forEach((row) => {
            emptyCells = emptyCells.concat(row.filter(cell => cell === ""));
        });

        return (emptyCells.length === 0 && checkForWinner() === false);
    }

    return {board, lock, unlock, resetBoard, getTurn, getLockStatus, nextTurn, getCell, setCell, updateCellDisplay, eraseCell, checkForWinner, checkForTie};
})();

// Game State and Events
const player1 = Player("one", "X");
const player2 = Player("two", "O");
const players = [player1, player2];

// Setup board events for players
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

// Setup player controls
const player1Symbol = $("#player1-symbol");
player1Symbol.textContent = player1.getTeamSymbol();
const player1SymbolInput = $("#sidebar input[name='player1-symbol']");
const player1StatsSymbol = $("#player1-symbol");
const player1SymbolBtn = $("#player1-container input[name='player1-symbol'] + button");
player1SymbolBtn.addEventListener("click", (event) => {
    if (player1SymbolInput.value == "") return;
    player1.setTeamSymbol(player1SymbolInput.value);
    player1Symbol.textContent = player1SymbolInput.value;
    player1SymbolInput.value = "";
});

const player1NameInput = $("#sidebar input[name='player1-name']");
const player1StatsName = $("#player1-name");
const player1NameBtn = $("#player1-container input[name='player1-name'] + button");
player1NameBtn.addEventListener("click", (event) => {
    console.log(palyer1.NameInput.value);
    player1StatsName.textContent = player1NameInput.value;
    player1NameInput.value = "";
});

const player2Symbol = $("#player2-symbol");
player2Symbol.textContent = player2.getTeamSymbol();
const player2SymbolInput = $("#sidebar input[name='player2-symbol']");
const player2StatsSymbol = $("#player2-symbol");
const player2SymbolBtn = $("#player2-container input[name='player2-symbol'] + button");
player2SymbolBtn.addEventListener("click", (event) => {
    if (player2SymbolInput.value == "") return;
    player2.setTeamSymbol(player2SymbolInput.value);
    player2Symbol.textContent = player2SymbolInput.value;
    player2SymbolInput.value = "";
});

const player2NameInput = $("#sidebar input[name='player2-name']");
const player2StatsName = $("#player2-name");
const player2NameBtn = $("#player2-container input[name='player2-name'] + button");
player2NameBtn.addEventListener("click", (event) => {
    player2StatsName.textContent = player2NameInput.value;
    player2NameInput.value = "";
});

// Other controls
const resetBtn = $("#reset-button");
resetBtn.addEventListener("click", (event) => {
    gameBoard.resetBoard();
});
