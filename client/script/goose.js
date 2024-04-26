const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d
const nameDiv = document.getElementById('playerName');
const backgroundMusic = document.getElementById("background-music");
const missionImpossible = document.getElementById("mission-impossible");

let gameEnded = false; //serve per gestire disconnessione da vittoria 

// partenza lenta di una musica
function slowStart (music, increment) {
    music.volume = 0.1;
    music.play();
    const fadeInterval = setInterval(() => {
        if (music.volume < 1) music.volume += increment;
        if (music.volume >= 0.9) clearInterval(fadeInterval);
    }, 2000);
}

// quando la finestra si carica, parte la musica (col volume basso) e piano piano aumneta
window.addEventListener('load', () => { slowStart(backgroundMusic, 0.05); });

// la classe per un player
class Player {
    constructor(n) {
        this.turn = n;
        this.velocity = {x: 5, y: 5};
        this.isMoving = false;
        this.direction = 'x';
        this.cell = 1;

        const image = new Image();
        if (n) image.src = '../images/rook.png';
        if (!n) image.src = '../images/queen.png';

        // aspettiamo che l'immagine si carichi
        image.onload = () => {
            const SCALE = 0.15;
            this.image = image;
            this.width = image.width * SCALE;
            this.height = image.height * SCALE;
            if (n) {
                this.position = {x: 75, y: 75};
                this.targetPosition = {x: 75, y: 75};
            }
            if (!n) { 
                this.position = {x: 150, y: 75};
                this.targetPosition = {x: 150, y: 75};
            }
        };
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };

    update() {
        if (this.image) {
            this.draw();
            if (this.isMoving) {
                const dx = this.targetPosition.x - this.position.x;
                const dy = this.targetPosition.y - this.position.y;
                
                if (this.direction === 'x') {
                    if (Math.abs(dx) <= Math.abs(this.velocity.x)) {
                        this.position.x = this.targetPosition.x;
                        this.isMoving = false;
                    } else {
                        this.position.x += dx > 0 ? this.velocity.x : -this.velocity.x;
                    }
                } else if (this.direction === 'y') {
                    if (Math.abs(dy) <= Math.abs(this.velocity.y)) {
                        this.position.y = this.targetPosition.y;
                        this.isMoving = false;
                    } else {
                        this.position.y += dy > 0 ? this.velocity.y : -this.velocity.y;
                    }
                }
            }
        }
    };
    
    moveByCells (number) {
        this.isMoving = true;
        const targetCell = this.cell + number;
        // ogni 500ms facciamo un 'passo'
        this.moveByCellsRecursively (targetCell);
    };

    moveByCellsRecursively (targetCell) {
        const CELLWIDTH = 150;
        const CELLHEIGHT = 100;
        const OFFSET = 90;
        this.isMoving = true;
        const flipcard = document.querySelector('.flip-card');
        const flipcardfront=document.querySelector('.flip-card-front');
        const flipcardback=document.querySelector('.flip-card-back');

        // caso base: siamo arrivati alla cella finale
        if (this.cell == targetCell) {
            this.isMoving = false;
            showFlipCard(this.cell);
            return;
        }
        flipcard.style.visibility='hidden';

        handleCellRedirection(this.cell,roomId);


        if (this.cell >= 0 && this.cell < 9) {
            this.direction = 'x';
            this.targetPosition.x += CELLWIDTH;
        } else if (this.cell >= 9 && this.cell < 15) {
            this.direction = 'y';
            this.targetPosition.y += CELLHEIGHT;
        } else if (this.cell >= 15 && this.cell < 23) {
            this.direction = 'x';
            // TODO: cercare di integrare questo offset senza che l'animazione vada a fanculo
            // if (this.cell == 15) {
            //     this.targetPosition.x -= OFFSET; 
            // }
            this.targetPosition.x -= CELLWIDTH;
        } else if (this.cell >= 23 && this.cell < 27) {
            this.direction = 'y';
            this.targetPosition.y -= CELLHEIGHT;
        } else if (this.cell >= 27 && this.cell < 33) {
            this.direction = 'x';
            // if (this.cell == 27) {
            //     this.targetPosition.x += OFFSET - 15;
            // }
            this.targetPosition.x += CELLWIDTH;
        } else if (this.cell >= 33 && this.cell < 35) {
            this.direction = 'y';
            this.targetPosition.y += CELLHEIGHT;
        } else if (this.cell >= 35 && this.cell < 39) {
            this.direction = 'x';
            this.targetPosition.x -= CELLWIDTH;
        }
        
        this.cell++;
        // con ogni spostamento controlla chi è primo
        setFirst();

        const moveSound = new Audio('../audios/piece-move.wav');
        moveSound.volume = 0.5;
        moveSound.play();

        setTimeout(() => {
            // altro caso base: la cella a cui siamo arrivati è la 39: vittoria
            if (this.cell == 39) this.win();
            this.moveByCellsRecursively(targetCell);
        }, 500);
    }


    win() {
        // TODO gestione vittoria (da fare: toast modale etc)
        //alert('viva un dittatore a piacimento');
        socket.emit('gameEnd',roomId);
    }
};

// GESTIONE USERNAME
let username = ''; 
// ogni client prende l'username dai cookie
window.addEventListener('DOMContentLoaded', () => {
    const usernameCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('username='));
    username = usernameCookie ? usernameCookie.split('=')[1] : 'Utente';
});
// all'inizio il div viene settato a 'pareggio'
// ad ogni passaggio di turno si controlla chi è il player più vicino alla fine
nameDiv.textContent = 'Pareggio';

// funziona che controlla chi è primo
function setFirst() {
    if (primaryPlayer.cell > secondaryPlayer.cell) {
        nameDiv.textContent = username;
    } else if (primaryPlayer.cell < secondaryPlayer.cell) {
        socket.emit('requestOtherUsername', roomId);
        socket.on('otherUsername', (data) => {
            nameDiv.textContent = data;
    });
    } else nameDiv.textContent = 'Pareggio';
};


// Funzione per gestire il reindirizzamento dei giocatori in base alla cella
function handleCellRedirection(cell, roomId) {
    // Definizione delle condizioni per il reindirizzamento
    const redirectionConditions = {
        6: 'memory',
        11: 'cfs'
    };

    // Controlla se la cella corrente ha una condizione di reindirizzamento definita
    if (redirectionConditions.hasOwnProperty(cell)) {
        const game = redirectionConditions[cell];
        // Emit il segnale a tutti i client nella stanza per reindirizzare al gioco specificato
        socket.emit('redirectToGame', { game: game });
    }
}



// GESTIONE SOCKET
// prendiamo il parametro roomId dall'url per riconnettersi alla stanza
// i websocket (come socket.io) non sono persistenti tra pagine html diverse
// usiamo questo trucco per mantenere la connessione tra diverse pagine
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');
const socket = io.connect('http://localhost:3000');

// i due player si uniscono alla stanza
socket.emit('joinExistingRoom', roomId);
let turn;
let primaryPlayer = {};
let secondaryPlayer = {};
socket.on('yourTurn', (data) => {
    turn = data;
    // compare la scritta 'è il tuo turno'
    if (turn) appearTurn();
    primaryPlayer = new Player(turn);
    secondaryPlayer = new Player(!turn);
})



// gestione delle animazioni
function animate() {
    requestAnimationFrame(animate);    
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (primaryPlayer instanceof Player) {
        primaryPlayer.update();
    }
    if (secondaryPlayer instanceof Player) {
        secondaryPlayer.update();
    }
};
animate();

// gestione del dado
const dado = document.getElementById("dice");
const dadoContainer = document.querySelector(".diceCont");
let isRolling = false;
function rollDice(number) {
    return new Promise((resolve, reject) => {
        if (isRolling) { 
            reject('Il dado sta già girando');
            return;
        }       
        isRolling = true;
        turn = false;
        // suono del dado
        const diceSound = new Audio('../audios/dice-roll.wav');
        diceSound.volume = 0.7;
        diceSound.play();

        // comparsa del dado
        dadoContainer.style.opacity = '1';

        let dadoNumber = number;
        if (!number) dadoNumber = Math.floor(Math.random() * 6) + 1;

        for (let i = 1; i <= 6; i++) dado.classList.remove('show-' + i);
        requestAnimationFrame(() => {
            dado.classList.add('show-' + dadoNumber);
        });

        setTimeout(() => {
            // scomparsa del dado
            setTimeout(() => { 
                isRolling = false;
                dadoContainer.style.opacity = '0'; 
                resolve(dadoNumber); // return the number after the animation is done
            }, 500);
        }, 1500); 
    });
};


// gestione del lancio del dado
button.addEventListener('click', () => { 
    if (!isRolling && turn) movePlayer(primaryPlayer);
});

// funzione per lo spostamento del player principale
function movePlayer(player) {
    if (turn) {
        turn = false; 
        if (!player.isMoving) {
            player.isMoving = true;
            // utilizziamo uno schema di premessa/then per animare PRIMA il dado e POI restituire il numero
            rollDice(false).then(dadoNumber => {
                changeMusic(primaryPlayer.cell + dadoNumber);
                player.moveByCells(dadoNumber);
                socket.emit('requestMoveSecondaryPlayer', { dice: dadoNumber, roomId: roomId });

                const checkIsMoving = setInterval(() => {
                    if (!player.isMoving) {
                        clearInterval(checkIsMoving);
                        socket.emit('requestChangeTurn', roomId);
                    }
                }, 100);
            }).catch(error => {
                console.log(error); 
            });
        }
    }
};

// gestione spostamento dell'altro giocatore
socket.on('moveSecondaryPlayer', (data) => {
    if (!turn && !secondaryPlayer.ismoving) {
        rollDice(data);
        setTimeout(() => {
            secondaryPlayer.moveByCells(data);
        }, 600);
    }
})

// gestione assegnazione dei turni
socket.on('changeTurn', () => {
    turn = true;

    // compare scritta 'è il turno'
    if (primaryPlayer.cell != 39 && secondaryPlayer.cell != 39) appearTurn();
});

// funzione che fa apparire la scritta con il proprio turno
function appearTurn() {
    if(gameEnded) return;
    const yourTurnDiv = document.getElementById('yourTurn');
    yourTurnDiv.style.visibility = 'visible';
    setTimeout(() => {
        yourTurnDiv.style.opacity = '1';
    }, 200);

    setTimeout(() => {
        yourTurnDiv.style.opacity = '0';
    }, 1300);

    setTimeout(() => {
        yourTurnDiv.style.visibility = 'hidden';
    }, 2000);
}


function showFlipCard(cell) {
    const flipcard = document.querySelector('.flip-card');
    const flipcardfront = document.querySelector('.flip-card-front');
    const flipcardback = document.querySelector('.flip-card-back');
    if(cell == 30 ){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/minerva.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto!  Hai guardato la minerva negli occhi, devi saltare un turno.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else if(cell== 9){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/fisica.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto! Non hai passato l'esame di fisica, devi saltare un turno e tornare al prossimo appello.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else if(cell== 38){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/tesi.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto! Devi scrivere la tesi, salta un turno.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else if(cell== 3){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Hai superato un esonero, tira il dado 2 volte.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else if(cell== 36){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Hai superato un esonero, tira il dado 2 volte.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else if(cell== 26){
        flipcard.style.visibility = 'visible';
        flipcardfront.style.backgroundImage = `url('../images/relatore.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Sei riuscito a trovare un relatore per la tesi, tira il dado 2 volte.</p>`;
    
        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
        }, 45000);
    }
    else{
        flipcard.style.visibility='hidden';
    }
    
}

// cambio musica raggiunta la cella 30
let change = false;
function changeMusic(cell) {
    if (!change && cell >= 27) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        slowStart(missionImpossible, 0.1);
        change = true;
    } else if (change && cell < 30) {
        missionImpossible.pause();;
        missionImpossible.currentTime = 0;
        slowStart(backgroundMusic, 0.1);
        change = false;
    }
}



// TODO gestione vittoria, sconfitta e disconnessione forzata

//gestione disconnessione forzata 

//caso di refresh della pagina
window.addEventListener('beforeunload',()=>{
    socket.emit('requestForcedDisconnect', roomId);
})

//caso di chiusura della pagina
window.addEventListener('unload', function(event) {
    socket.emit('requestForcedDisconnect', roomId);
});

socket.on('forcedDisconnect',()=>{
    
        // Invia la notifica di vittoria a tavolino solo se il gioco non è ancora terminato
        const winToast = new bootstrap.Toast(document.getElementById('winToast'));
        winToast.show();
        gameEnded = true; //  per evitare notifiche duplicate

        setTimeout(() => {
            winToast.hide();
        }, 3000);

        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    
})


socket.on('gameWon', () => {
    if (!gameEnded) {
        const winToast = new bootstrap.Toast(document.getElementById('customWinToast'));
        winToast.show();

        gameEnded = true; // per evitare notifiche duplicate

        setTimeout(() => {
            winToast.hide();
        }, 3000);

        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
});

socket.on('gameLost', () => {
    if (!gameEnded) {
        const loseToast = new bootstrap.Toast(document.getElementById('loseToast'));
        loseToast.show();

        gameEnded = true; 

        setTimeout(() => {
            loseToast.hide();
            window.location.href = '/';
        }, 3000);
    }
});

socket.on('redirectBothToGame', (game) => {
    redirectPlayersToGame(game);
});


// Funzione per reindirizzare entrambi i giocatori al gioco specificato
function redirectPlayersToGame(game) {
    if (game === 'memory') {
        window.location.href = '/memory'; // Reindirizza a Memory
    } else if (game === 'cfs') {
        window.location.href = '/cfs'; // Reindirizza a CFS
    }
}





