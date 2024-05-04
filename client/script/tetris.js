document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    let interval; // Variabile per l'intervallo del timer
    let gameEnded = false;

    render(); // Inizializzazione del gioco

    board.addEventListener("click", (e) => {
        if(gameEnded)return;
        const cellIndex = parseInt(e.target.id);
        if (!isNaN(cellIndex) && gameBoard[cellIndex] === "") {
            gameBoard[cellIndex] = currentPlayer;
            render();
            if (checkWinner() && currentPlayer === "X") {
                alert("Player wins!");
                endGame();
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                if (currentPlayer === "O") {
                    setTimeout(makeAIMove, 500);
                }
            }
        }
    });

    function render() {
        board.innerHTML = "";
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.innerText = cell;
            cellElement.id = index;
            board.appendChild(cellElement);
        });
    }

    function checkWinner() {
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        return winningConditions.some((condition) => {
            const [a, b, c] = condition;
            return (
                gameBoard[a] &&
                gameBoard[a] === gameBoard[b] &&
                gameBoard[a] === gameBoard[c]
            );
        });
    }

    function makeAIMove() {
        const emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (cell === "") {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMove = emptyCells[randomIndex];
        gameBoard[aiMove] = currentPlayer;
        render();

        if (checkWinner() && currentPlayer === "O") {
            endGame();
            alert("AI wins!");
        } else if (!gameBoard.includes("")) {
            alert("It's a draw!");
            endGame();
        } else {
            currentPlayer = "X";
        }
    }
    
    function endGame() {
        // Disabilita il click sulla board per terminare il gioco
        board.removeEventListener("click", handleBoardClick);
        board.style.pointerEvents = "none";
        gameEnded=true;
    }

    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            display.textContent = minutes + ":" + seconds;
    
            if (--timer < 0) {
                clearInterval(interval);
                endGame(); // Controlla la fine della partita quando il timer arriva a zero
            }
        }, 1000);
    }
    
    
    // Funzione per avviare il timer con una durata di 3 minuti (180 secondi)
    function startGameTimer() {
        var threeMinutes = 60,
            display = document.querySelector('#timer');
        startTimer(threeMinutes, display);
        updateTimerBar(threeMinutes);
    }
    // Funzione per aggiornare la barra del timer
    function updateTimerBar(duration) {
        var timerBar = document.querySelector('#timerBar');
        timerBar.style.animationDuration = duration + 's'; // Imposta la durata dell'animazione
    }
    
    // Avvia il timer quando la finestra si carica
    window.onload = function () {
        startGameTimer();
    };
});
