document.addEventListener('DOMContentLoaded', function () {
    const playerPaddle = document.getElementById('playerPaddle');
    const computerPaddle = document.getElementById('computerPaddle');
    const ball = document.getElementById('ball');

    let ballX = 390;
    let ballY = 190;
    let ballSpeedX = 0;
    let ballSpeedY = 0;

    const paddleHeight = 100;
    const paddleWidth = 10;
    const paddleSpeed = 4;
    let computerPaddleY = 150;
    let playerPaddleY = 150;

    const gameContainer = document.querySelector('.game-container');
    const gameHeight = gameContainer.clientHeight;
    const gameWidth = gameContainer.clientWidth;
    let gameStarted = false;

    const ballDiameter = ball.clientWidth;
    const ballRadius = ballDiameter / 2;

    // Set the initial position of the ball to the center of the game container
    ball.style.left = `${gameWidth / 2 - ballRadius}px`;
    ball.style.top = `${gameHeight / 2 - ballRadius}px`;

    ball.addEventListener('click', () => {
        gameStarted = true;
        ballSpeedX = 4; 
        ballSpeedY = 4; 
        update();
    });

    

    function update() {
        if (!gameStarted) {
            return;
        }


        if (playerScore== 3) {
            alert('Congratulazioni, hai vinto!');
            endGame();
            return;
            
        }
        else if (computerScore== 3) {
            alert('Hai perso!');
            document.location.reload();
            return;
        }

        
        moveBall();
        moveComputerPaddle();
        checkCollision();
        requestAnimationFrame(update);
        updateScores();
        displayScores();



    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX <= 0 || ballX >= gameWidth - 20) {
            ballSpeedX *= -1;
        }

        if (ballY <= 0 || ballY >= gameHeight - 20) {
            ballSpeedY *= -1;
        }

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }


    /*function moveComputerPaddle() {
        const ballCenterY = ballY + 10;
        const computerPaddleCenterY = computerPaddleY + paddleHeight / 2;
    
        // Determina la distanza tra il centro della racchetta del computer e il centro della palla
        const deltaY = ballCenterY - computerPaddleCenterY;
    
        // Muovi la racchetta del computer solo se la palla si sta avvicinando al computer
        if (Math.abs(deltaY) > paddleHeight / 4) {
            if (deltaY < 0 && computerPaddleY > 0) {
                computerPaddleY -= paddleSpeed;
            } else if (deltaY > 0 && computerPaddleY < gameHeight - paddleHeight) {
                computerPaddleY += paddleSpeed;
            }
        }
    
        computerPaddle.style.top = computerPaddleY + 'px';
    }*/

    let computerPaddleSpeed = 3;
    let computerPaddleDirection = 1;

    function moveComputerPaddle() {
        computerPaddleY += computerPaddleSpeed * computerPaddleDirection;

        if (computerPaddleY <= 0 || computerPaddleY >= gameHeight - paddleHeight) {
            computerPaddleDirection *= -1; // Change the direction of the paddle when it hits the top or bottom of the game container
        }

        computerPaddle.style.top = computerPaddleY + 'px';
    }
    

    function checkCollision() {
        if (ballX <= 30 && ballY >= playerPaddleY && ballY <= playerPaddleY + paddleHeight) {
            ballSpeedX *= -1;
        }

        if (ballX >= gameWidth - 40 && ballY >= computerPaddleY && ballY <= computerPaddleY + paddleHeight) {
            ballSpeedX *= -1;
        }
    }

    gameContainer.addEventListener('mousemove', function (event) {
        const mouseY = event.clientY - gameContainer.getBoundingClientRect().top;
        playerPaddleY = mouseY - paddleHeight / 2;
        if (playerPaddleY < 0) {
            playerPaddleY = 0;
        } else if (playerPaddleY > gameHeight - paddleHeight) {
            playerPaddleY = gameHeight - paddleHeight;
        }
        playerPaddle.style.top = playerPaddleY + 'px';
    });

    // Step 1: Create variables for scores
    let playerScore = 0;
    let computerScore = 0;

    // Step 2: Update scores
    function updateScores() {
        if (ballX + 20 >= gameWidth) {
            playerScore += 1;
        } else if (ballX <= 0) {
            computerScore += 1;
        }
    }

    // Step 3: Display scores
    function displayScores() {
        document.getElementById('playerScore').textContent = playerScore;
        document.getElementById('computerScore').textContent = computerScore;
    }

    
        

    update();

    function endGame() {
        setTimeout(()=>{
          socket.emit('quitGame', { roomId: roomId, 
            primaryPlayerPosition: primaryPosition,
            secondaryPlayerPosition: secondaryPosition,
            win: win, 
            turn: turn });
        }, 1000);
      
    }
    
    
    //GESTIONE SERVER
    const urlParams = new URLSearchParams(window.location.search);
    // prendo i parametri passati tramite chiamata GET
    const roomId = urlParams.get('room');
    const primaryPosition = urlParams.get('pos1');
    const secondaryPosition = urlParams.get('pos2')
    const turn = urlParams.get('turn');
    const socket = io.connect('http://localhost:3000');
    
    socket.emit("joinExistingRoom",roomId);
    
    socket.on('redirect', (data) => {
    // Effettua il reindirizzamento alla nuova pagina
    window.location.href = data;
    });
    

    
});

