document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resultDisplay = document.getElementById("result");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    let interval; // Variabile per l'intervallo del timer


    //GESTIONE SERVER
    const urlParams = new URLSearchParams(window.location.search);
    // prendo i parametri passati tramite chiamata GET
    const roomId = urlParams.get('room');
    const primaryPosition = urlParams.get('pos1');
    const secondaryPosition = urlParams.get('pos2')
    const turn = urlParams.get('turn');
    const socket = io.connect('http://localhost:3000');
    let win=false;

    socket.emit("joinExistingRoom",roomId);


    render(); // Inizializzazione del gioco

    board.addEventListener("click", handleClick); // Aggiunta dell'evento click

    function handleClick(e) {
        const cellIndex = parseInt(e.target.id);
        if (!isNaN(cellIndex) && gameBoard[cellIndex] === "") {
            gameBoard[cellIndex] = currentPlayer;
            render();
            if (checkWinner() && currentPlayer === "X") {
                resultDisplay.textContent = "Hai vinto!";
                resultDisplay.style.opacity = "1";
            } else if (checkWinner() && currentPlayer === "O") {
                resultDisplay.textContent = "Hai perso...";
                resultDisplay.style.opacity = "1";
            } else if (!gameBoard.includes("")) {
                resultDisplay.textContent = "Pareggio";
                resultDisplay.style.opacity = "1";
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                if (currentPlayer === "O") {
                    setTimeout(makeAIMove, 500);
                }
            }
        }
    }

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
            resultDisplay.textContent = "Hai perso...";
        } else if (!gameBoard.includes("")) {
            resultDisplay.textContent = "Pareggio";
        } else {
            currentPlayer = "X";
        }
    }
    
    function endGame() {
        // Disabilita il click sulla board per terminare il gioco
        board.removeEventListener("click", handleClick);
        board.style.pointerEvents = "none";

        if (checkWinner() && currentPlayer === "X") {
            win=true;
        } else if (checkWinner() && currentPlayer === "O") {
            win=false;
        } else if (!gameBoard.includes("")) {
            win=false;
        }

        setTimeout(() => {
    
            setTimeout(()=>{
                socket.emit('quitGame', { roomId: roomId, 
                                        primaryPlayerPosition: primaryPosition,
                                        secondaryPlayerPosition: secondaryPosition,
                                        win: win, 
                                        turn: turn });
            }, 1000);
        }, 1000);
    }
    
    function startTimer(duration) {
        var timer = duration, minutes, seconds;
        interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            if (--timer < 0) {
                clearInterval(interval);
                endGame(); // Controlla la fine della partita quando il timer arriva a zero
                if (checkWinner()) {
                    console.log(currentPlayer + " wins!");
                } else {
                    console.log("It's a draw!");
                }
            }
        }, 1000);
    }
    
    
    // Funzione per avviare il timer con una durata di 3 minuti (180 secondi)
    function startGameTimer() {
        var Minutes = 15;
        startTimer(Minutes);
        updateTimerBar(Minutes);
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
    
    socket.on('redirect', (data) => {
        // Effettua il reindirizzamento alla nuova pagina
        window.location.href = data;
    });
    
});


