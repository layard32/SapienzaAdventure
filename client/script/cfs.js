let gameStarted = false; // Flag per indicare se il gioco è in corso
let playerOneScore = 0; // Punteggio del giocatore uno
let playerTwoScore = 0; // Punteggio del giocatore due
let playerOneChoice = ''; // Scelta del giocatore uno
let playerTwoChoice = ''; // Scelta del giocatore due
let timer; // Timer per il turno del computer
let timeout; // Timeout per il turno del computer


startGame();

// Funzione per la scelta casuale del computer
function computerChoice() {
    const choices = ['rock', 'paper', 'scissors']; // Opzioni possibili
    return choices[Math.floor(Math.random() * choices.length)]; // Restituisce una scelta casuale
}

// Funzione per aggiornare le scelte dei giocatori
function updateChoices(playerSelection, computerSelection) {
    const playerSign = document.getElementById('playerSign'); // Emoji del giocatore
    const computerSign = document.getElementById('computerSign'); // Emoji del computer

    // Imposta l'emoji corrispondente alla scelta del giocatore
    switch (playerSelection) {
        case 'rock':
            playerSign.textContent = '✊'; // Pugno
            break;
        case 'paper':
            playerSign.textContent = '✋'; // Mano
            break;
        case 'scissors':
            playerSign.textContent = '✌'; // Forbici
            break;
    }

    // Imposta l'emoji corrispondente alla scelta del computer
    switch (computerSelection) {
        case 'rock':
            computerSign.textContent = '✊'; // Pugno
            break;
        case 'paper':
            computerSign.textContent = '✋'; // Mano
            break;
        case 'scissors':
            computerSign.textContent = '✌'; // Forbici
            break;
    }
}

// Funzione per iniziare il turno
function startTurn(playerNum) {
    timer = setTimeout(() => {
        const randomChoice = computerChoice(); // Scelta casuale del computer
        playGame(randomChoice, playerNum); // Avvia il gioco con la scelta casuale del computer
    }, 100000); // Timeout di 100 secondi per il turno del computer

    timeout = setTimeout(() => {
        clearTimeout(timer); // Interrompe il timer se il giocatore fa una mossa prima del timeout
    }, 100000);
}

// Funzione per giocare una partita
function playGame(choice, playerNum) {
    clearTimeout(timeout); // Interrompe il timeout se il giocatore fa una mossa

    // Controlla se il gioco è in corso
    if (!gameStarted) {
        alert('You must start the game before playing!');
        return;
    }

    // Assegna la scelta al giocatore corrispondente
    if (playerNum === 1) {
        playerOneChoice = choice; // Assegna la scelta del giocatore uno
        updateChoices(playerOneChoice, ''); // Aggiorna le emoji dei giocatori

        const computerMove = computerChoice(); // Scelta casuale del computer
        updateChoices('', computerMove); // Aggiorna l'emoji del computer

        playerTwoChoice = computerMove; // Assegna la scelta del computer al giocatore due
    } else {
        playerTwoChoice = choice; // Assegna la scelta del giocatore due
        updateChoices('', playerTwoChoice); // Aggiorna l'emoji del computer
    }

    // Verifica se entrambi i giocatori hanno fatto una scelta
    if (playerOneChoice && playerTwoChoice) {
        let result = ''; // Risultato della partita

        // Determina il vincitore o se c'è un pareggio
        if (playerOneChoice === playerTwoChoice) {
            result = 'TIE'; // Pareggio
        } else {
            switch (playerOneChoice) {
                case 'rock':
                    result = (playerTwoChoice === 'scissors') ? 'PLAYER' : 'COMPUTER'; // Vincitore in base alla scelta del giocatore uno
                    break;
                case 'paper':
                    result = (playerTwoChoice === 'rock') ? 'PLAYER' : 'COMPUTER'; // Vincitore in base alla scelta del giocatore uno
                    break;
                case 'scissors':
                    result = (playerTwoChoice === 'paper') ? 'PLAYER' : 'COMPUTER'; // Vincitore in base alla scelta del giocatore uno
                    break;
            }
        }

        // Aggiorna i punteggi
        updateScores(result);

        // Mostra il risultato della partita
        displayResult(result);


        var timerDisplay = document.querySelector('#timer');
        var timerValue = timerDisplay.textContent;
        // Controlla se il gioco è finito
        if (timerValue==="00:00") {
            clearInterval(interval);
            endGame(); // Termina il gioco
        }
    
        // Resetta le scelte dei giocatori
        playerOneChoice = '';
        playerTwoChoice = '';
    }
}

// Funzione per aggiornare i punteggi
function updateScores(result) {
    // Se il giocatore uno vince, incrementa il suo punteggio
    if (result === 'PLAYER') {
        playerOneScore++;
    } 
    // Se il computer vince, incrementa il suo punteggio
    else if (result === 'COMPUTER') {
        playerTwoScore++;
    }

    // Aggiorna i punteggi visualizzati a schermo
    const playerOneScoreDisplay = document.getElementById("playerScore");
    const playerTwoScoreDisplay = document.getElementById("computerScore");
    playerOneScoreDisplay.textContent = "Player: " + playerOneScore;
    playerTwoScoreDisplay.textContent = "Computer: " + playerTwoScore;
}

// Funzione per mostrare il risultato della partita
function displayResult(result) {
    // Ottiene gli elementi per visualizzare il risultato
    const scoreInfo = document.getElementById("scoreInfo");
    const scoreMessage = document.getElementById("scoreMessage");

    // Mostra il messaggio corrispondente al risultato
    switch (result) {
        case 'TIE':
            scoreInfo.textContent = "It's a tie!"; // Pareggio
            scoreMessage.textContent = "Both players chose the same weapon."; // Entrambi i giocatori hanno scelto la stessa arma
            break;
        case 'PLAYER':
            scoreInfo.textContent = "You win!"; // Vittoria del giocatore
            scoreMessage.textContent = getWinningMessage(playerOneChoice, playerTwoChoice); // Messaggio di vittoria
            break;
        case 'COMPUTER':
            scoreInfo.textContent = "You lose..."; // Sconfitta del giocatore
            scoreMessage.textContent = getWinningMessage(playerTwoChoice, playerOneChoice); // Messaggio di sconfitta
            break;
    }
}

// Funzione per ottenere il messaggio di vittoria/sconfitta
function getWinningMessage(winningChoice, losingChoice) {
    // Determina il messaggio in base alle scelte
    switch (winningChoice) {
        case 'rock':
            return (losingChoice === 'scissors') ? 'Rock crushes scissors' : 'Paper covers rock';
        case 'paper':
            return (losingChoice === 'rock') ? 'Paper covers rock' : 'Scissors cuts paper';
        case 'scissors':
            return (losingChoice === 'paper') ? 'Scissors cuts paper' : 'Rock crushes scissors';
    }
}

// Funzione per avviare il gioco
function startGame() {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverModal = document.getElementById('gameOverModal');

    // Nasconde lo schermo iniziale e mostra quello di gioco
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    gameOverModal.style.display = 'none';

    // Resetta il gioco
    resetGame();

    // Imposta il flag del gioco a true
    gameStarted = true;

    // Inizia il turno del giocatore uno
    startTurn(1);
}

// Aggiunge un event listener al pulsante di avvio del gioco
//document.getElementById('startButton').addEventListener('click', startGame);

// Funzione per controllare se il gioco è in corso
function checkGameStarted() {
    // Se il gioco non è in corso, mostra un messaggio e ritorna falso
    if (!gameStarted) {
        alert('You must start the game before playing!');
        return false;
    }
    // Altrimenti ritorna vero
    return true;
}

// Funzione per riavviare il gioco
function restartGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';

    // Abilita tutti i pulsanti delle scelte
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    // Resetta il gioco
    resetGame();

    // Avvia il gioco
    startGame();
}

// Funzione per uscire dal gioco
function quitGame() {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverModal = document.getElementById('gameOverModal');

    // Mostra lo schermo iniziale e nasconde quello di gioco
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    gameOverModal.style.display = 'none';

    // Resetta il gioco
    resetGame();
}

// Funzione per chiudere il modale
function closeModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
}

// Funzione per resettare il gioco
function resetGame() {
    const playerSign = document.getElementById('playerSign');
    const computerSign = document.getElementById('computerSign');
    const playerOneScoreDisplay = document.getElementById("playerScore");
    const playerTwoScoreDisplay = document.getElementById("computerScore");

    // Resetta le emoji e i punteggi
    playerSign.textContent = "❔";
    computerSign.textContent = "❔";
    playerOneScoreDisplay.textContent = "Player: 0";
    playerTwoScoreDisplay.textContent = "Computer: 0";

    // Abilita tutti i pulsanti delle scelte
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    // Resetta le variabili di gioco
    gameStarted = false;
    playerOneScore = 0;
    playerTwoScore = 0;
    playerOneChoice = '';
    playerTwoChoice = '';

    // Resetta il testo di scelta dei giocatori
    document.getElementById('scoreInfo').textContent = 'Choose your weapon';
    document.getElementById('scoreMessage').textContent = 'First to win 2 rounds wins the game';
}

// Funzione per avviare il timer
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
    var threeMinutes = 5,
        display = document.querySelector('#timer');
    startTimer(threeMinutes, display);
}

// Avvia il timer quando la finestra si carica
window.onload = function () {
    startGameTimer();
};


//GESTIONE SERVER
const urlParams = new URLSearchParams(window.location.search);
// prendo i parametri passati tramite chiamata GET
const roomId = urlParams.get('room');
const primaryPosition = urlParams.get('pos1');
const secondaryPosition = urlParams.get('pos2')
const turn = urlParams.get('turn');
const socket = io.connect('http://localhost:3000');

socket.emit("joinExistingRoom",roomId);


// Funzione per terminare il gioco
function endGame() {
    // Disabilita tutti i pulsanti delle scelte
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = true;
    });

    // Mostra il messaggio di vittoria/sconfitta dopo un secondo
    setTimeout(() => {
        const message = (playerOneScore === 2) ? 'You won!' : 'You lost...';
        const winMessage = document.getElementById('winMessage');
        winMessage.textContent = message;

        // Mostra il modale di fine gioco
        const gameOverModal = document.getElementById('gameOverModal');
        gameOverModal.style.display = 'block';

        // Disabilita tutti i pulsanti delle scelte
        document.querySelectorAll('.emoji-buttons button').forEach(button => {
            button.disabled = true;
        });

        setTimeout(()=>{
            socket.emit('quitGame', { roomId: roomId, 
                                    primaryPlayerPosition: primaryPosition,
                                    secondaryPlayerPosition: secondaryPosition,
                                    win: (playerOneScore>playerTwoScore), 
                                    turn: turn });
        }, 1000);
    }, 1000);
}

socket.on('redirect', (data) => {
    // Effettua il reindirizzamento alla nuova pagina
    window.location.href = data;
});