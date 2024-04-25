const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d


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
            if(this.cell == 30 ){
                showFlipCard('../images/minerva.png', 'IMPREVISTO', "Oh no, c'è stato un imprevisto!  Hai guardato la minerva negli occhi, devi saltare un turno.");
            }
            else if(this.cell== 9){
                showFlipCard('../images/fisica.png', 'IMPREVISTO', "Oh no, c'è stato un imprevisto! Non hai passato l'esame di fisica, devi saltare un turno e tornare al prossimo appello.");
            }
            else if(this.cell== 38){
                showFlipCard('../images/tesi.png', 'IMPREVISTO', "Oh no, c'è stato un imprevisto! Devi scrivere la tesi, salta un turno.");
            }
            else if(this.cell== 3){
                showFlipCard('../images/esonero.png', 'BONUS', "Bravo! Hai superato un esonero, tira il dado 2 volte.");
            }
            else if(this.cell== 36){
                showFlipCard('../images/esonero.png', 'BONUS', "Bravo! Hai superato un esonero, tira il dado 2 volte.");
            }
            else if(this.cell== 26){
                showFlipCard('../images/relatore.png', 'BONUS', "Bravo! Sei riuscito a trovare un relatore per la tesi, tira il dado 2 volte.");
            }
            else{
                flipcard.style.visibility='hidden';
            }
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
        alert('viva un dittatore a piacimento');
    }
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
};

// gestione spostamento dell'altro giocatore
socket.on('moveSecondaryPlayer', (data) => {
    secondaryPlayer.moveByCells(data);
})

// gestione assegnazione dei turni
socket.on('changeTurn', () => {
    turn = true;
});


// TODO gestione vittoria, sconfitta e disconnessione forzata

//gestione disconnessione forzata 
window.addEventListener('beforeunload',()=>{
    socket.emit('requestForcedDisconnect', roomId);
})

socket.on('oppenentDisconnect',()=>{
    const message = "Hai vinto a tavolino!";
    alert(message);
    setTimeout(() => {
        if (document.querySelector('.alert')) {
            document.querySelector('.alert').remove();
        }
    }, 3000);
    
    setInterval(() => {
        const nextPage = '/';
        window.location.href = nextPage;
    }, 5000);
    
})

function showFlipCard(imageUrl, title, description) {
    const flipcard = document.querySelector('.flip-card');
    const flipcardfront = document.querySelector('.flip-card-front');
    const flipcardback = document.querySelector('.flip-card-back');

    flipcard.style.visibility = 'visible';
    flipcardfront.style.backgroundImage = `url('${imageUrl}')`;
    flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>${title}</h1>`;
    flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>${title}</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>${description}</p>`;
    
    setTimeout(() => {
        flipcard.style.visibility = 'hidden';
    }, 45000);
}
