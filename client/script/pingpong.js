document.addEventListener('DOMContentLoaded', function () {
    startGameTimer();

    const playerPaddle = document.getElementById('playerPaddle');
    const computerPaddle = document.getElementById('computerPaddle');
    const ball = document.getElementById('ball');

    //si inizializzano le variabili per la velocità della palla
    let ballSpeedX = 0;
    let ballSpeedY = 0;

    const paddleHeight = playerPaddle.clientHeight;
    
    const gameContainer = document.querySelector('.game-container');
    
    let gameStarted = false;
    let gameHeight = gameContainer.clientHeight;
    let gameWidth = gameContainer.clientWidth;

    let computerPaddleY = gameHeight-paddleHeight+1;//150;
    let playerPaddleY = gameHeight- paddleHeight+1;//150;



    let ballX = gameWidth-gameWidth/2;
    let ballY = gameHeight-gameHeight/2;

    const ballDiameter = ball.clientWidth;
    const ballRadius = ballDiameter / 2;

    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('modalText');


    //imposta la posizione iniziale della palla al centro del gioco
    ball.style.left = `${gameWidth / 2 - ballRadius}px`;
    ball.style.top = `${gameHeight / 2 - ballRadius}px`;

    //una volta che l'utente fa clic sulla palla, il gioco inizia e la pallina inizia a muoversi
    ball.addEventListener('click', () => {
        gameStarted = true;
        ballSpeedX = 4; 
        ballSpeedY = 4; 
        update();
    });

    //funzione per aggiornare la posizione della palla in caso di fine partita e in cui vengono chiamate le varie funzioni per far partire il gioco
    function update() {
        //se il gioco non è ancora iniziato, non succede nulla
        if (!gameStarted) {
            return;
        }

        //se il giocatore raggiunge i 3 punti, la palla si ferma e torna al centro del campo e viene mostrato il modale di fine partita
        if (playerScore== 3) {
            ballSpeedX = 0; 
            ballSpeedY = 0;
            ball.style.left = `${gameWidth / 2 - ballRadius}px`;
            ball.style.top = `${gameHeight / 2 - ballRadius}px`;
            showEndGameModal('Hai vinto!');
            return; 
        }
        //se il computer raggiunge i 3 punti, la palla si ferma e torna al centro del campo e viene mostrato il modale di fine partita
        else if (computerScore== 3) {
            ballSpeedX = 0; 
            ballSpeedY = 0;
            ball.style.left = `${gameWidth / 2 - ballRadius}px`;
            ball.style.top = `${gameHeight / 2 - ballRadius}px`;
            showEndGameModal('Hai perso!');
            return;
        }

        moveBall();
        moveComputerPaddle();
        checkCollision();
        requestAnimationFrame(update);
        updateScores();
        displayScores();
    }

    //funzione per la gestione del movimento della palla
    function moveBall() {
        //quando inizia il gioco, la palla inizia a muoversi
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        //se la palla colpisce il bordo del campo cambia direzione
        if (ballX <= 0 || ballX >= gameWidth - 20) {
            ballSpeedX *= -1;
        }

        if (ballY <= 0 || ballY >= gameHeight - 20) {
            ballSpeedY *= -1;
        }
        //la posizione della palla viene aggiornata usando le proprietà left e top di css
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }

    let computerPaddleSpeed = 4;
    let computerPaddleDirection = 1;
    computerPaddleY=0;

    //Funzione per il movimento della racchetta del computer
    function moveComputerPaddle() {
        computerPaddleY += computerPaddleSpeed * computerPaddleDirection;

        //quando la racchetta del computer raggiunge il bordo del campo cambia direzione
        if (computerPaddleY <= 0 || computerPaddleY >= gameHeight - paddleHeight) {
            computerPaddleDirection *= -1; 
        }
        //viene aggiornata la posizione della racchetta del computer
        computerPaddle.style.top = computerPaddleY + 'px';
    }
    
    //Funzione per controllare la collisione della palla con le racchette 
    function checkCollision() {
        //se la palla colpisce la racchetta del player o del computer, cambia direzione
        if (ballX <= 30 && ballY >= playerPaddleY && ballY <= playerPaddleY + paddleHeight) {
            ballSpeedX *= -1;
        }

        if (ballX >= gameWidth - 40 && ballY >= computerPaddleY && ballY <= computerPaddleY + paddleHeight) {
            ballSpeedX *= -1;
        }
    }

    //gestione del movimento della racchetta del player grazie all'evento mousemove e touchmove
    function movePaddle(event) {
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const mouseY = clientY - gameContainer.getBoundingClientRect().top;
        //la posizione della racchetta del player viene aggiornata in base alla posizione del mouse
        playerPaddleY = mouseY - paddleHeight / 2;
        //se la posizione della racchetta del player è maggiore o minore della dimensione del campo la racchetta si ferma ai bordi
        if (playerPaddleY < 0) {
            playerPaddleY = 0;
        } else if (playerPaddleY > gameHeight - paddleHeight) {
            playerPaddleY = gameHeight - paddleHeight;
        }
        //viene aggiornata la posizione della racchetta del player
        playerPaddle.style.top = playerPaddleY + 'px';
    }
    
    gameContainer.addEventListener('mousemove', movePaddle);
    gameContainer.addEventListener('touchmove', movePaddle);

    let playerScore = 0;
    let computerScore = 0;

    //funzione per aggiornare i punteggi
    function updateScores() {
        if (ballX + 20 >= gameWidth) {
            playerScore += 1;
        } else if (ballX <= 0) {
            computerScore += 1;
        }
    }

    function displayScores() {
        document.getElementById('playerScore').textContent = playerScore;
        document.getElementById('computerScore').textContent = computerScore;
    }    

    //funzione per avviare il timer
    function startTimer(duration) {
        var timer = duration, minutes, seconds;
        interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
      
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
      
            if (--timer < 0) {
              clearInterval(interval);
              ballSpeedX = 0;
              ballSpeedY = 0;
              ball.style.left = `${gameWidth / 2 - ballRadius}px`;
              ball.style.top = `${gameHeight / 2 - ballRadius}px`;
              endGame(); 
            }
        }, 1000);
    }
    
    //funzione per avviare il timer con una durata di 45 secondi
    function startGameTimer() {
        var Minutes = 45;
        startTimer(Minutes);
        updateTimerBar(Minutes);
    }

    //funzione per aggiornare la barra del timer
    function updateTimerBar(duration) {
        var timerBar = document.querySelector('#timerBar');
        timerBar.style.animationDuration = duration + 's'; // Imposta la durata dell'animazione
    }
    
    //funzione per reindirizzare i giocatori alla pagina principale alla fine della partita
    function endGame() {
        setTimeout(()=>{
          socket.emit('quitGame', { roomId: roomId, 
            primaryPlayerPosition: primaryPosition,
            secondaryPlayerPosition: secondaryPosition,
            win: (playerScore==3), 
            turn: turn });
        }, 1000);
    }

    //funzione per mostrare il modale di fine partita
    function showEndGameModal(message) {
        modalText.textContent = message;
        modal.style.display = 'block';
    }
    
    //funzione per nascondere il modale di fine partita
    function hideEndGameModal() {
        modal.style.display = 'none';
    }
    
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideEndGameModal(); 
        });
    }
});

//GESTIONE SERVER
const urlParams = new URLSearchParams(window.location.search);
//prendo i parametri passati tramite chiamata GET
const roomId = urlParams.get('room');
const primaryPosition = urlParams.get('pos1');
const secondaryPosition = urlParams.get('pos2')
const turn = urlParams.get('turn');
const socket = io.connect('http://localhost:3000');
    
socket.emit("joinExistingRoom",roomId);
    
socket.on('redirect', (data) => {
    //i giocatori vengono reindirizzati a goose
    window.location.href = data;
});