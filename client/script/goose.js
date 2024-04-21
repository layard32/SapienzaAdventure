const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d

// n = 0 per il primo giocatore, n = 1 per il secondo!
// questa costante viene gestita dal server
const n = 0;
// anche questa costante viene gestita dal server, se è pari a true significa
// che il player attuale può lanciare il dado
const turn = true;

// la classe per un player
class Player {
    constructor(n) {
        const image = new Image();
        if (n == 0) image.src = '/client/images/rook.png';
        if (n == 1) image.src = '/client/images/queen.png';

        // aspettiamo che l'immagine si carichi
        image.onload = () => {
            const SCALE = 0.15;
            this.image = image;
            this.width = image.width * SCALE;
            this.height = image.height * SCALE;
            if (n == 0) this.position = {x: 75, y: 75};
            if (n == 1) this.position = {x: 150, y: 75};
        };
    }

    firstDraw() {
        if (this.image) c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };
};

// inizializziamo il player e facciamo partire il loop di animazione
const player = new Player(n);
function animate() {
    requestAnimationFrame(animate);    
    player.firstDraw();
};

animate();

// gestione del lancio del dado
button.addEventListener('click', () => {
    if (turn) rollDice();
});

function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
}

