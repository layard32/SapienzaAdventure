document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resultDisplay = document.getElementById("result");

    let currentPlayer = "X"; //di default il player è X (il computer è O) e comincia sempre il player
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    let interval; // variabile per l'intervallo del timer

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


    render(); // avvio il gioco

    board.addEventListener("click", handleClick); // gestisco i click sulla tabella

    function handleClick(e) {
        const cellIndex = parseInt(e.target.id);
        if (!isNaN(cellIndex) && gameBoard[cellIndex] === "") {
            //se la casella è vuota e viene cliccata, sostituisco con il simbolo del currentPlayer 
            gameBoard[cellIndex] = currentPlayer;
            render(); //aggiorno la visualizzazione del tabellone
            if (checkWinner() && currentPlayer === "X") {
                //controllo se ci troviamo in una condizione di vittoria e chi è il currentPlayer
                resultDisplay.textContent = "Hai vinto!";
                resultDisplay.style.opacity = "1";

                //se ho vinto voglio disabilitare i click sulla tabella 
                board.removeEventListener("click", handleClick);
                board.style.pointerEvents = "none";

            } else if (checkWinner() && currentPlayer === "O") {
                resultDisplay.textContent = "Hai perso...";
                resultDisplay.style.opacity = "1";

                //se ho perso voglio disabilitare i click sulla tabella 
                board.removeEventListener("click", handleClick);
                board.style.pointerEvents = "none";

            } else if (!gameBoard.includes("")) {
                //se non si è in una condizione di vittoria e il tabellone non contiene una casella vuota, allora è un pareggio
                resultDisplay.textContent = "Pareggio";
                resultDisplay.style.opacity = "1";
            } else {
                //se ancora non si in una condizione di vittoria e ci sono delle caselle vuoto e il player è O, faccio fare la mossa al computer
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                if (currentPlayer === "O") {
                    setTimeout(makeAIMove, 250);
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

    //funzione per capire se il player ha vinto o no 
    function checkWinner() {
        //tutte le possibili combinazione di vittoria
        const winningConditions = [
            [0, 1, 2], // prima riga
            [3, 4, 5], // seconda riga
            [6, 7, 8], // terza riga
            [0, 3, 6], // prima colonna
            [1, 4, 7], // seconda colonna
            [2, 5, 8], // terza colonna
            [0, 4, 8], // diagonale da sinistra a destra
            [2, 4, 6]  // diagonale da destra a sinistra
        ];
        
        //con some verifico se esiste una combinazione vincente
        return winningConditions.some((condition) => {
            const [a, b, c] = condition;
            return (
                gameBoard[a] && // c'è un simbolo "X" o "O" in quella posizione
                gameBoard[a] === gameBoard[b] && // il primo e il secondo elemento sono uguali
                gameBoard[a] === gameBoard[c] // il primo e il terzo elemento sono uguali
            );            
        });
    }

    //serve per creare la mossa del computer (che di default è il player O)
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
            resultDisplay.style.opacity = "1";
            //se ho perso voglio disabilitare i click sulla tabella 
            board.removeEventListener("click", handleClick);
            board.style.pointerEvents = "none";
        } else if (!gameBoard.includes("")) {
            resultDisplay.textContent = "Pareggio";
        } else {
            currentPlayer = "X";
        }
    }
    
    function endGame() {
        // disabilito il click sulla board per terminare il gioco
        board.removeEventListener("click", handleClick);
        board.style.pointerEvents = "none";

        if (checkWinner() && currentPlayer === "X") {
            //il player ha vinto
            win=true;
        } else if (checkWinner() && currentPlayer === "O") {
            //il computer ha vinto (player perde)
            win=false;
        } else if (!gameBoard.includes("")) {
            win=false;
        }

        setTimeout(() => {
    
            setTimeout(()=>{
                //notifica il server che è finito il gioco
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

    //funzione per il timer 
    function startGameTimer() {
        var Minutes = 15;
        startTimer(Minutes);
        updateTimerBar(Minutes);
    }

    function updateTimerBar(duration) {
        var timerBar = document.querySelector('#timerBar');
        timerBar.style.animationDuration = duration + 's'; // Imposta la durata dell'animazione
    }
    
    // avvio il timer quando la finestra si carica
    window.onload = function () {
        startGameTimer();
    };
    
    socket.on('redirect', (data) => {
        // effettuo il reindirizzamento al goose
        window.location.href = data;
    });
});