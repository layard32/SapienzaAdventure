
// Variabili per tenere traccia dello stato del gioco
let gameStarted = false; // Indica se la partita è in corso o no
let currentTurn = 1; // Il turno corrente (1 per il giocatore 1, 2 per il giocatore 2)
let playerOneChoice = ''; // Scelta del giocatore 1
let playerTwoChoice = ''; // Scelta del giocatore 2
let timer; // Variabile per il timer del turno
let timeout; // Variabile per il timeout del turno

// Funzione per iniziare il turno di un giocatore con un limite di tempo
function startTurn(playerNum) {
    // Imposta il timer
    timer = setTimeout(() => {
        // Se il tempo scade, esegue una mossa casuale per il giocatore
        const choices = ['rock', 'paper', 'scissors'];
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        playGame(randomChoice, playerNum);
    }, 10000); // Tempo in millisecondi (10 secondi)

    // Imposta un timeout per interrompere il timer se il giocatore fa una scelta prima del tempo
    timeout = setTimeout(() => {
        clearTimeout(timer);
    }, 10000);
}

// Funzione per gestire il gioco
function playGame(choice, playerNum) {
    clearTimeout(timeout); // Cancella il timeout se il giocatore ha fatto una scelta
    clearTimeout(timer); // Cancella il timer se il giocatore ha fatto una scelta

    if (!checkGameStarted()) {
        return;
    }

    if (playerNum === 1) {
        playerOneChoice = choice;
        const playerOneDisplay = document.getElementById('playerOneDisplay');
        playerOneDisplay.textContent = "PLAYER_ONE: " + playerOneChoice;
    } else if (playerNum === 2) {
        playerTwoChoice = choice;
        const playerTwoDisplay = document.getElementById('playerTwoDisplay');
        playerTwoDisplay.textContent = "PLAYER_TWO: " + playerTwoChoice;
    }

    if (playerOneChoice && playerTwoChoice) {
        let result = '';

        if (playerOneChoice === playerTwoChoice) {
            result = 'PAREGGIO';
        } else {
            switch (playerOneChoice) {
                case 'rock':
                    result = (playerTwoChoice === 'scissors') ? 'PLAYER ONE' : 'PLAYER TWO';
                    break;
                case 'paper':
                    result = (playerTwoChoice === 'rock') ? 'PLAYER ONE' : 'PLAYER TWO';
                    break;
                case 'scissors':
                    result = (playerTwoChoice === 'paper') ? 'PLAYER ONE' : 'PLAYER TWO';
                    break;
            }
        }

        const playerOneScoreDisplay = document.getElementById("playerOneScoreDisplay");
        const playerTwoScoreDisplay = document.getElementById("playerTwoScoreDisplay");

        if (result === 'PLAYER ONE') {
            playerOneScoreDisplay.textContent++;
        } else if (result === 'PLAYER TWO') {
            playerTwoScoreDisplay.textContent++;
        }

        currentTurn++;

        const turnDisplay = document.getElementById('turnDisplay');
        turnDisplay.textContent = "FINE TURNO " + (currentTurn-1);

        if (playerOneScoreDisplay.textContent === '2' || playerTwoScoreDisplay.textContent === '2') {
            const winner = (playerOneScoreDisplay.textContent === '2') ? 'PLAYER ONE' : 'PLAYER TWO';
            const winMessage = document.getElementById('winMessage');
            winMessage.textContent = `GIOCO FINITO! ${winner} VINCE!`;

            const gameOverModal = document.getElementById('gameOverModal');
            gameOverModal.style.display = 'block';

            // Disabilita i pulsanti per impedire ulteriori mosse
            document.querySelectorAll('.emoji-buttons button').forEach(button => {
                button.disabled = true;
            });
        }

        playerOneChoice = '';
        playerTwoChoice = '';
    }
}

// Funzione per avviare la partita
function startGame() {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverModal = document.getElementById('gameOverModal');

    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    gameOverModal.style.display = 'none';

    resetGame(); // Resettare lo stato del gioco

    gameStarted = true; // Imposta gameStarted su true
    currentTurn = 1;

    // Avvia il turno del primo giocatore
    startTurn(1);
}

// Aggiungi un gestore di eventi al pulsante "Avvio Partita" nella schermata iniziale
document.getElementById('startButton').addEventListener('click', startGame);

// Funzione per controllare se la partita è stata avviata prima di eseguire un'azione di gioco
function checkGameStarted() {
    if (!gameStarted) {
        alert('Devi avviare la partita prima di giocare!');
        return false;
    }
    return true;
}

// Funzione per ricominciare la partita
function restartGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';

    // Riabilita i pulsanti
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    startGame(); // Ricomincia la partita
}

// Funzione per abbandonare la partita
function quitGame() {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverModal = document.getElementById('gameOverModal');

    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    gameOverModal.style.display = 'none';

    resetGame(); // Resettare lo stato del gioco
}

// Funzione per chiudere il modal di fine gioco
function closeModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
}

// Funzione per resettare lo stato del gioco
function resetGame() {
    const playerOneDisplay = document.getElementById('playerOneDisplay');
    const playerTwoDisplay = document.getElementById('playerTwoDisplay');
    const playerOneScoreDisplay = document.getElementById("playerOneScoreDisplay");
    const playerTwoScoreDisplay = document.getElementById("playerTwoScoreDisplay");

    playerOneDisplay.textContent = "PLAYER_ONE:";
    playerTwoDisplay.textContent = "PLAYER_TWO:";
    playerOneScoreDisplay.textContent = "0";
    playerTwoScoreDisplay.textContent = "0";

    const turnDisplay = document.getElementById('turnDisplay');
    turnDisplay.textContent = ""; // Resettare il display del turno

    // Riabilita i pulsanti
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    gameStarted = false;
    currentTurn = 1;
    playerOneChoice = '';
    playerTwoChoice = '';
}
