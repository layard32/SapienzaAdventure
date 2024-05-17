let gameStarted = false; // flag per indicare se il gioco è in corso
let playerOneScore = 0; // punteggio giocatore uno
let playerTwoScore = 0; // punteggio giocatore due
let playerOneChoice = '';// scelta giocatore uno
let playerTwoChoice = ''; // scelta giocatore due
let timer; // Timer per il turno del computer
let timeout; // Timeout per il turno del computer


startGame();//come prima cosa avvio il gioco

//creo una funzione per le scelte del computer (che sarebbe il giocatore 2)
function computerChoice() {
    const choices = ['sasso', 'carta', 'forbice']; // Opzioni possibili
    return choices[Math.floor(Math.random() * choices.length)]; 
}

// questa funzione serve per aggiornare lo schermo in base alle scelte fatte
function updateChoices(playerSelection, computerSelection) {
    const playerSign = document.getElementById('playerSign'); 
    const computerSign = document.getElementById('computerSign'); 

    //aggiorna lo schermo in base alla scelta del giocatore 1 (Player)
    switch (playerSelection) {
        case 'sasso':
            playerSign.textContent = '✊'; 
            break;
        case 'carta':
            playerSign.textContent = '✋';
            break;
        case 'forbice':
            playerSign.textContent = '✌';
            break;
    }

    //aggiorna lo schermo in base alla scelta del giocatore 2 (Computer)
    switch (computerSelection) {
        case 'sasso':
            computerSign.textContent = '✊'; 
            break;
        case 'carta':
            computerSign.textContent = '✋';
            break;
        case 'forbice':
            computerSign.textContent = '✌';
            break;
    }
}

//questa funzione definisci che inizia per primo il turno (di default comincia sempre il giocatore 1)
function startTurn(playerNum) {
    timer = setTimeout(() => {
        const randomChoice = computerChoice(); // Scelta casuale del computer
        playGame(randomChoice, playerNum); // Avvia il gioco con la scelta casuale del computer
    }, 100000); // Timeout di 100 secondi per il turno del computer

    timeout = setTimeout(() => {
        clearTimeout(timer); // Interrompe il timer se il giocatore fa una mossa prima del timeout
    }, 100000);
}

// gestisce la logica del gioco 
function playGame(choice, playerNum) {
    clearTimeout(timeout); //se il giocatore fa una mossa fermo il timeout

    // controlla se il gioco è in corso
    if (!gameStarted) {
        alert('You must start the game before playing!');
        return;
    }

    // assegna la scelta al giocatore corrispondente
    if (playerNum === 1) {
        playerOneChoice = choice; // ora il player 1 può fare la sua scelta 
        updateChoices(playerOneChoice, '');

        const computerMove = computerChoice(); //dopo che il player 1 ha fatto la sua scelte, il computer fa la sua in modo casuale
        updateChoices('', computerMove);

        playerTwoChoice = computerMove; //scelta casuale del computer
    } else {
        playerTwoChoice = choice; // è il turno del computer
        updateChoices('', playerTwoChoice);
    }

    // verifico se entrambi i giocatori hanno fatto una scelta e visualizzo il risultato
    if (playerOneChoice && playerTwoChoice) {
        let result = ''; 

        // controllo se c'è il vincitore o se c'è un pareggio
        if (playerOneChoice === playerTwoChoice) {
            result = 'TIE'; // Pareggio
        } else {
            switch (playerOneChoice) {
                //in base alla scelta fatta dal player 1 vedo se ha vinto, pareggiato o perso
                case 'sasso':
                    result = (playerTwoChoice === 'forbice') ? 'PLAYER' : 'COMPUTER'; 
                    break;
                case 'carta':
                    result = (playerTwoChoice === 'sasso') ? 'PLAYER' : 'COMPUTER';
                    break;
                case 'forbice':
                    result = (playerTwoChoice === 'carta') ? 'PLAYER' : 'COMPUTER'; 
                    break;
            }
        }

        //aggiorno i punteggi
        updateScores(result);

        displayResult(result);

    
        //resetto le scelte dei due player a 0 (perchè cominicia un nuovo turno)
        playerOneChoice = '';
        playerTwoChoice = '';
    }
}

//aggiorno i punteggi dei player
function updateScores(result) {
    // Se player 1 vince, incremento il suo punteggio
    if (result === 'PLAYER') {
        playerOneScore++;
    } 
    // Se il computer vince, incremento il suo punteggio
    else if (result === 'COMPUTER') {
        playerTwoScore++;
    }

    // aggiorno il display mostrando i punteggi
    const playerOneScoreDisplay = document.getElementById("playerScore");
    const playerTwoScoreDisplay = document.getElementById("computerScore");
    playerOneScoreDisplay.textContent = "Player: " + playerOneScore;
    playerTwoScoreDisplay.textContent = "Computer: " + playerTwoScore;
}

//mostra il risultato
function displayResult(result) {
    const scoreInfo = document.getElementById("scoreInfo");


    // mostra un messaggio corrispondente al risultato
    switch (result) {
        case 'TIE':
            scoreInfo.textContent = "Pareggio!";
        case 'PLAYER':
            scoreInfo.textContent = "Hai vinto!"; //il player 1 ha vinto
            break;
        case 'COMPUTER':
            scoreInfo.textContent = "Hai perso..."; // player 1 ha perso (player ha vinto)
            break;
    }
}


//avvio il gioco
function startGame() {
    resetGame();

    gameStarted = true;

    // inizia il turno facendo iniziare il giocatore uno
    startTurn(1);
}


//per controllare se il gioco è in corso
function checkGameStarted() {
    // Se il gioco non è in corso, mostra un messaggio e ritorna falso
    if (!gameStarted) {
        alert('You must start the game before playing!');
        return false;
    }
    return true;
}

//per riavviare il gioco
function restartGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';

    // abilito tutti i pulsanti
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    // resetto il gioco
    resetGame();

    // avvio il gioco
    startGame();
}


// per resettare il gioco 
function resetGame() {
    const playerSign = document.getElementById('playerSign');
    const computerSign = document.getElementById('computerSign');
    const playerOneScoreDisplay = document.getElementById("playerScore");
    const playerTwoScoreDisplay = document.getElementById("computerScore");

    playerSign.textContent = "❔";
    computerSign.textContent = "❔";
    playerOneScoreDisplay.textContent = "Player: 0";
    playerTwoScoreDisplay.textContent = "Computer: 0";

    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = false;
    });

    gameStarted = false;
    playerOneScore = 0;
    playerTwoScore = 0;
    playerOneChoice = '';
    playerTwoChoice = '';

    document.getElementById('scoreInfo').textContent = 'Fai la tua scelta';
    document.getElementById('scoreMessage').textContent = 'Vinci per ottenere punti bonus per la corsa verso la Laurea!';
}

//serve per avviare il timer
function startTimer(duration) {
    var timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;


        if (--timer < 0) {
            clearInterval(interval);
            endGame(); //quando il timer arriva a zero, faccio finire la partita e comincia il reindirizzamento
        }
    }, 1000);
}

function startGameTimer() {
    var Minutes = 30;
    startTimer(Minutes);
    updateTimerBar(Minutes);
}

function updateTimerBar(duration) {
    var timerBar = document.querySelector('#timerBar');
    timerBar.style.animationDuration = duration + 's';
}

// avvio il timer quando la finestra si carica
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


//quando il gioco è finito
function endGame() {
    // disabilito tutti i pulsanti
    document.querySelectorAll('.emoji-buttons button').forEach(button => {
        button.disabled = true;
    });

    setTimeout(()=>{
        //mando segnale al server che ho finito il gioco
        socket.emit('quitGame', { roomId: roomId, 
                                primaryPlayerPosition: primaryPosition,
                                secondaryPlayerPosition: secondaryPosition,
                                win: (playerOneScore>playerTwoScore), 
                                turn: turn });
    }, 1000);
}

socket.on('redirect', (data) => {
    // effettuo il reindirizzamento al goose
    window.location.href = data;
});