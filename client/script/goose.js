const canvas = document.getElementById('canvas'); // si prende l'elemento canvas
const c = canvas.getContext('2d'); // in questo modo verrà renderizzato in 2d

// settiamo le dimensioni uguali all'oggetto window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// settiamo un event listener alla window così che in caso di resize, canvas
// continui ad occupare l'intera finestra
// const resizeCanvas = function() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// };
// window.addEventListener('resize', resizeCanvas);

// la classe per un player
class Player {
    constructor(n) {
        const image = new Image();
        if (n == 0) image.src = '/client/images/rook.png';
        if (n == 1) image.src = '/client/images/queen.png';

        // aspettiamo che l'immagine si carichi
        image.onload = () => {
            const SCALE = 0.10;
            this.image = image;
            this.width = image.width * SCALE;
            this.height = image.height * SCALE;
            this.position = {
                x: 200,
                y: 200
            }    
        };
    }

    // funzione per disegnare effettivamente su canvas il giocatore
    draw() {
        if (this.image) c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };
};

// creiamo player 0
const player = new Player(0);

// funzione loop di animazione
function animate() {
    requestAnimationFrame(animate);    
    player.draw();
};

animate();
