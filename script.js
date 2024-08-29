document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart');

    // Sound elements
    const placeSound = document.getElementById('placeSound');
    const winSound = document.getElementById('winSound');
    
    const ROWS = 6;
    const COLUMNS = 7;
    const EMPTY = '';
    const PLAYER_ONE = 'red';
    const PLAYER_TWO = 'yellow';
    
    let currentPlayer = PLAYER_ONE;
    let board = Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(EMPTY));
    let gameActive = true;

    // Initialize the game board
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }
    }

    // Handle cell click
    function handleCellClick(e) {
        if (!gameActive) return;

        const col = parseInt(e.target.getAttribute('data-col'));
        const row = findEmptyRow(col);

        if (row !== null) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);
            
            // Play placement sound
            placeSound.play();
            
            checkWinner(row, col);
            currentPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
        }
    }

    // Find the lowest empty row in a column
    function findEmptyRow(col) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === EMPTY) {
                return row;
            }
        }
        return null;
    }

    // Check for a winner
    function checkWinner(row, col) {
        if (checkDirection(row, col, 1, 0) || // Horizontal
            checkDirection(row, col, 0, 1) || // Vertical
            checkDirection(row, col, 1, 1) || // Diagonal down-right
            checkDirection(row, col, 1, -1)) { // Diagonal down-left
            
            statusDisplay.textContent = `${currentPlayer.toUpperCase()} WINS!`;
            
            // Apply styles based on the winner
            statusDisplay.style.color = currentPlayer === PLAYER_ONE ? 'red' : 'yellow';
            statusDisplay.style.fontWeight = 'bold';
            statusDisplay.style.fontSize = '24px';
            statusDisplay.style.textShadow = `0 0 10px ${currentPlayer === PLAYER_ONE ? 'red' : 'yellow'}`;
            
            // Play win sound
            winSound.play();
            
            gameActive = false;
        } else if (board.flat().every(cell => cell !== EMPTY)) {
            statusDisplay.textContent = 'It\'s a tie!';
            statusDisplay.style.color = 'white';
            statusDisplay.style.fontWeight = 'bold';
            statusDisplay.style.fontSize = '24px';
            statusDisplay.style.textShadow = '0 0 10px white';
            gameActive = false;
        }
    }

    // Check a specific direction
    function checkDirection(row, col, rowDir, colDir) {
        let count = 1;
        count += countInDirection(row, col, rowDir, colDir);
        count += countInDirection(row, col, -rowDir, -colDir);
        return count >= 4;
    }

    // Count consecutive pieces in a specific direction
    function countInDirection(row, col, rowDir, colDir) {
        let r = row + rowDir;
        let c = col + colDir;
        let count = 0;

        while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === currentPlayer) {
            count++;
            r += rowDir;
            c += colDir;
        }

        return count;
    }

    // Restart the game
    restartButton.addEventListener('click', () => {
        board = Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(EMPTY));
        gameActive = true;
        currentPlayer = PLAYER_ONE;
        statusDisplay.textContent = '';
        createBoard();
    });

    // Start the game
    createBoard();
});
