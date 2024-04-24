const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d



// n = 0 per il primo giocatore, n = 1 per il secondo!
// questa costante viene gestita dal server
const n = 1;
// anche questa costante viene gestita dal server, se è pari a true significa
// che il player attuale può lanciare il dado
const turn = true;

// la classe per un player
class Player {
    constructor(n) {
        this.velocity = {x: 5, y: 5};
        this.isMoving = false;
        this.direction = 'x';
        this.cell = 1;

        const image = new Image();
        if (n == 0) image.src = '../images/rook.png';
        if (n == 1) image.src = '../images/queen.png';

        // aspettiamo che l'immagine si carichi
        image.onload = () => {
            const SCALE = 0.15;
            this.image = image;
            this.width = image.width * SCALE;
            this.height = image.height * SCALE;
            if (n == 0) {
                this.position = {x: 75, y: 75};
                this.targetPosition = {x: 75, y: 75};
            }
            if (n == 1) { 
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
        this.iMoving = true;
        const targetCell = this.cell + number;
        console.log(targetCell)
        // ogni 500ms facciamo un 'passo'
        this.moveByCellsRecursively (targetCell);
    };

    moveByCellsRecursively (targetCell) {
        const CELLWIDTH = 150;
        const CELLHEIGHT = 100;
        const OFFSET = 90;
        this.isMoving = true;
        const cardminerva = document.querySelector('.flip-card-minerva');


        // caso base: siamo arrivati alla cella finale
        if (this.cell == targetCell) {
            this.isMoving = false;
            if(this.cell == 30 ){
                cardminerva.style.visibility='visible';
            }
            else{
                cardminerva.style.visibility='hidden';
            }
            if(this.cell== 9 ||  this.cell==38){
                alert("oh no c'è stato un imprevisto")
            }
            return;
        }
        cardminerva.style.visibility='hidden';


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
        alert("VINCERE E VINCEREMO");
    }
};

// inizializziamo i due player e facciamo partire il loop di animazione
const primaryPlayer = new Player(n);
const secondaryPlayer = new Player(1 - n);
function animate() {
    requestAnimationFrame(animate);    
    c.clearRect(0, 0, canvas.width, canvas.height);
    primaryPlayer.update();
    secondaryPlayer.update();
};
animate();

// gestione del lancio del dado
button.addEventListener('click', () => {
    if (turn && primaryPlayer.isMoving == false) {
        dice = Math.floor(Math.random() * 6) + 1;
        primaryPlayer.moveByCells(dice);
    };
});



const socket = io('http://localhost:3000');

socket.on('serverToClient', (data) => {
    alert(data)
})

socket.emit('clientToServer', "CIao server!!");
