(() => {
    'use strict';

    const PLAYER = {
        ONE: 1,
        TWO: 2
    };

    const GAME_STATE = {
        PLAYING: 'playing',
        WON: 'won',
        DRAW: 'draw'
    };

    class Connect4 {
        constructor(columns = 7, rows = 6) {
            this.columns = columns;
            this.rows = rows;
            this.currentPlayer = PLAYER.ONE;
            this.gameState = GAME_STATE.PLAYING;
            this.moveCount = 0;
            this.winningCells = [];

            this.grid = document.querySelector('.grid');
            this.result = document.querySelector('#result');
            this.displayCurrentPlayer = document.querySelector('#currentplayer');
            this.resetButton = document.querySelector('#reset-button');

            this.gameBoard = this.createGameBoard();
            this.bindEvents();
        }

        createGameBoard() {
            const board = [];
            this.grid.innerHTML = ''; // Clear existing content
            for (let i = 0; i < this.rows * this.columns; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.id = i;
                this.grid.appendChild(cell);
                board.push(cell);
            }
            return board;
        }

        bindEvents() {
            this.grid.addEventListener('click', this.handleClick.bind(this));
            this.resetButton.addEventListener('click', this.resetGame.bind(this));
        }

        handleClick(event) {
            if (this.gameState !== GAME_STATE.PLAYING) return;

            const cellIndex = parseInt(event.target.dataset.id);
            if (isNaN(cellIndex)) return;

            const columnIndex = cellIndex % this.columns;
            this.dropPiece(columnIndex);
        }

        dropPiece(columnIndex) {
            const lowestEmptyCell = this.findLowestEmptyCell(columnIndex);
            if (lowestEmptyCell === null) return;

            this.gameBoard[lowestEmptyCell].classList.add('taken', `player-${this.currentPlayer}`, 'animate');
            this.moveCount++;

            if (this.checkWin(lowestEmptyCell)) {
                this.endGame(`Player ${this.currentPlayer} Wins!`);
                this.highlightWinningCells();
            } else if (this.moveCount === this.rows * this.columns) {
                this.endGame("It's a Draw!");
            } else {
                this.switchPlayer();
            }
        }

        findLowestEmptyCell(columnIndex) {
            for (let row = this.rows - 1; row >= 0; row--) {
                const cellIndex = row * this.columns + columnIndex;
                if (!this.gameBoard[cellIndex].classList.contains('taken')) {
                    return cellIndex;
                }
            }
            return null;
        }

        checkWin(cellIndex) {
            const directions = [
                [1, 0], [0, 1], [1, 1], [1, -1] // horizontal, vertical, diagonal
            ];

            return directions.some(direction => {
                const line = this.getLine(cellIndex, direction);
                if (line.length >= 4) {
                    this.winningCells = line;
                    return true;
                }
                return false;
            });
        }

        getLine(cellIndex, [dx, dy]) {
            const line = [];
            const playerClass = `player-${this.currentPlayer}`;

            for (let i = -3; i <= 3; i++) {
                const x = cellIndex % this.columns + i * dx;
                const y = Math.floor(cellIndex / this.columns) + i * dy;
                const index = y * this.columns + x;

                if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) continue;
                if (!this.gameBoard[index].classList.contains(playerClass)) break;

                line.push(index);
            }

            return line;
        }

        highlightWinningCells() {
            this.winningCells.forEach(index => {
                this.gameBoard[index].classList.add('winning-cell');
            });
        }

        switchPlayer() {
            this.currentPlayer = this.currentPlayer === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;
            this.displayCurrentPlayer.textContent = this.currentPlayer;
        }

        endGame(message) {
            this.gameState = GAME_STATE.WON;
            this.result.innerHTML = message;
        }

        resetGame() {
            this.gameBoard.forEach(cell => {
                cell.className = 'cell';
            });
            this.currentPlayer = PLAYER.ONE;
            this.displayCurrentPlayer.textContent = this.currentPlayer;
            this.result.innerHTML = '';
            this.gameState = GAME_STATE.PLAYING;
            this.moveCount = 0;
            this.winningCells = [];
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new Connect4();
    });
})();
