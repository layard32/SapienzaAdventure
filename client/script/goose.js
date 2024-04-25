const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d
const nameDiv = document.getElementById('playerName');

let gameWon = false;//serve per gestire disconnessione da vittoria 


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
                // distanza tra la posizione attuale e la posizione target
                const dx = this.targetPosition.x - this.position.x;
                const dy = this.targetPosition.y - this.position.y;
                
                // controlla la direzione dello spostamento
                if (this.direction === 'x') {
                    // se il giocatore è arrivato alla posizione target sull'asse x
                    if (Math.abs(dx) < Math.abs(this.velocity.x)) {
                        this.position.x = this.targetPosition.x;
                        this.isMoving = false;
                    } else {
                        // si sposta gradualmente il giocatore
                        this.position.x += dx > 0 ? this.velocity.x : -this.velocity.x;
                    }
                } else if (this.direction === 'y') {
                    // se il giocatore è arrivato alla posizione target sull'asse y
                    if (Math.abs(dy) < Math.abs(this.velocity.y)) {
                        this.position.y = this.targetPosition.y;
                    } else {
                        // si sposta gradualmente il giocatore
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


        if (this.cell >= 0 && this.cell < 9) {
            this.direction = 'x';
            this.targetPosition.x += CELLWIDTH;
        } else if (this.cell >= 9 && this.cell < 15) {
            this.direction = 'y';
            this.targetPosition.y += CELLHEIGHT;
        } else if (this.cell >= 15 && this.cell < 23) {
            this.direction = 'x';
            if (this.cell == 15) {
                this.targetPosition.x -= OFFSET; 
            }
            this.targetPosition.x -= CELLWIDTH;
        } else if (this.cell >= 23 && this.cell < 27) {
            this.direction = 'y';
            this.targetPosition.y -= CELLHEIGHT;
        } else if (this.cell >= 27 && this.cell < 33) {
            this.direction = 'x';
            if (this.cell == 27) {
                this.targetPosition.x += OFFSET - 15;
            }
            this.targetPosition.x += CELLWIDTH;
        } else if (this.cell >= 33 && this.cell < 35) {
            this.direction = 'y';
            this.targetPosition.y += CELLHEIGHT;
        } else if (this.cell >= 35 && this.cell < 39) {
            this.direction = 'x';
            this.targetPosition.x -= CELLWIDTH;
        }
        

        this.cell++;

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
        console.log(username);
        nameDiv.textContent = username;
    } else if (primaryPlayer.cell < secondaryPlayer.cell) {
        socket.emit('requestOtherUsername', roomId);
        socket.on('otherUsername', (data) => {
            nameDiv.textContent = data;
            console.log(data);
    });
    } else nameDiv.textContent = 'Pareggio';
};



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

// gestione del lancio del dado
button.addEventListener('click', () => movePlayer(primaryPlayer));

// funzione per lo spostamento
function movePlayer(player) {
    if (turn) { 
        if (!player.isMoving) {
            dice = Math.floor(Math.random() * 6) + 1;

            player.moveByCells(dice);
            socket.emit('requestMoveSecondaryPlayer', { dice: dice, roomId: roomId });

            turn = false;
            const checkIsMoving = setInterval(() => {
                if (!player.isMoving) {
                    clearInterval(checkIsMoving);
                    socket.emit('requestChangeTurn', roomId);
                }
            }, 100);
        }
    }
    setFirst(); // questa funzione imposta il leader alla fine di ogni spostamento
};

// gestione spostamento dell'altro giocatore
socket.on('moveSecondaryPlayer', (data) => {
    secondaryPlayer.moveByCells(data);
})

// gestione assegnazione dei turni
socket.on('changeTurn', () => {
    turn = true;

    // compare scritta 'è il turno'
    if (primaryPlayer.cell != 39 && secondaryPlayer.cell != 39) appearTurn();
});



// funzione che fa apparire la scritta con il proprio turno
function appearTurn() {
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
    
    const winToast = new bootstrap.Toast(document.getElementById('winToast'));
    winToast.show();
    setTimeout(() => {
        winToast.hide();
    }, 3000);

    setTimeout(() => {
        winToast.hide();
        window.location.href = '/'; 
    }, 3000);
})


socket.on('gameWon', () => {
    const winToast = new bootstrap.Toast(document.getElementById('customWinToast'));
    winToast.show();

    setTimeout(() => {
        winToast.hide();
    }, 3000);

    setTimeout(() => {
        window.location.href = '/';
    }, 4000);
});

socket.on('gameLost', () => {
    alert("Hai perso!");
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
});


