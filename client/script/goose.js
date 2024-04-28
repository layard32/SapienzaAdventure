const CELLWIDTH = 150;
const CELLHEIGHT = 100;
const OFFSET = 90;
const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d'); // in questo modo canvas verrà renderizzato in 2d
const nameDiv = document.getElementById('playerName');
const backgroundMusic = document.getElementById("background-music");
const missionImpossible = document.getElementById("mission-impossible");

let gameEnded = false; //serve per gestire disconnessione da vittoria 

let bonusTurn = true;

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
    constructor(n, startingCell = 1) {
        this.turn = n;
        this.velocity = {x: 5, y: 5};
        this.isMoving = false;
        this.direction = 'x';
        this.cell = startingCell;

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
                if (this.cell != 1) {
                    const { x, y } = this.calculatePosition(this.cell);
                    this.position.x = this.targetPosition.x = x;
                    this.position.y = this.targetPosition.y = y;
                }
            }
            if (!n) { 
                this.position = {x: 150, y: 75};
                this.targetPosition = {x: 150, y: 75};
                if (this.cell != 1) {
                    const { x, y } = this.calculatePosition(this.cell);
                    this.position.x = this.targetPosition.x = x + 75; 
                    this.position.y = this.targetPosition.y = y;
                }
            }
        }
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
        // targetCell considera se il numero è negativo
        const targetCell = number > 0 ? this.cell + number : this.cell - Math.abs(number);
        // ogni 500ms facciamo un 'passo'
        this.moveByCellsRecursively (targetCell);
    };

    moveByCellsRecursively (targetCell) {
        this.isMoving = true;
        const flipcard = document.querySelector('.flip-card');
        const flipcardfront=document.querySelector('.flip-card-front');
        const flipcardback=document.querySelector('.flip-card-back');

        // caso base: siamo arrivati alla cella finale
        console.log('in questa iterazione!: ')
        console.log(this.cell)
        console.log(targetCell)
        if (this.cell == targetCell) {
            this.cell = targetCell; // Make sure this.cell is exactly targetCell
            this.isMoving = false;
            handleCellRedirection(this.cell);
            showFlipCard(this.cell);
            return;
        }
        flipcard.style.visibility='hidden';

        // TODO: Semplificare sto casino di if
        if (this.cell < targetCell) { // movimento in avanti
            if (this.cell >= 0 && this.cell < 9) {
                this.direction = 'x';
                this.targetPosition.x += CELLWIDTH;
            } else if (this.cell >= 9 && this.cell < 15) {
                this.direction = 'y';
                this.targetPosition.y += CELLHEIGHT;
            } else if (this.cell >= 15 && this.cell < 23) {
                this.direction = 'x';
                this.targetPosition.x -= CELLWIDTH;
            } else if (this.cell >= 23 && this.cell < 27) {
                this.direction = 'y';
                this.targetPosition.y -= CELLHEIGHT;
            } else if (this.cell >= 27 && this.cell < 33) {
                this.direction = 'x';
                this.targetPosition.x += CELLWIDTH;
            } else if (this.cell >= 33 && this.cell < 35) {
                this.direction = 'y';
                this.targetPosition.y += CELLHEIGHT;
            } else if (this.cell >= 35 && this.cell < 39) {
                this.direction = 'x';
                this.targetPosition.x -= CELLWIDTH;
            }
        } else if (this.cell > targetCell) { // movimento indietro
            if (this.cell > 0 && this.cell <= 9) {
                this.direction = 'x';
                this.targetPosition.x -= CELLWIDTH;
            } else if (this.cell > 9 && this.cell <= 15) {
                this.direction = 'y';
                this.targetPosition.y -= CELLHEIGHT;
            } else if (this.cell > 15 && this.cell <= 23) {
                this.direction = 'x';
                this.targetPosition.x += CELLWIDTH;
            } else if (this.cell > 23 && this.cell <= 27) {
                this.direction = 'y';
                this.targetPosition.y += CELLHEIGHT;
            } else if (this.cell > 27 && this.cell <= 33) {
                this.direction = 'x';
                this.targetPosition.x -= CELLWIDTH;
            } else if (this.cell > 33 && this.cell <= 35) {
                this.direction = 'y';
                this.targetPosition.y -= CELLHEIGHT;
            } else if (this.cell > 35 && this.cell <= 39) {
                this.direction = 'x';
                this.targetPosition.x += CELLWIDTH;
            }
        }
        
        // la cella viene aggiornata a seconda che ci siamo mossi in avanti o indietro
        if (this.cell < targetCell) {
            this.cell++;
        } else if (this.cell > targetCell) {
            this.cell--;
        }        
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

    calculatePosition(cell) {
        let x = this.position.x, y = this.position.y;
        if (cell >= 0 && cell < 9) {
            x += (cell - 2) * CELLWIDTH; // subtract 1 from cell count
        } else if (cell >= 9 && cell < 15) {
            x += CELLWIDTH * 8;
            y += (cell - 9) * CELLHEIGHT; // subtract 1 from cell count
        } else if (cell >= 15 && cell < 23) {
            x = this.position.x + CELLWIDTH * 8; // reset x to the start of the row
            y += CELLHEIGHT * 6;
            x -= (cell - 15) * CELLWIDTH; // subtract 1 from cell count
        } else if (cell >= 23 && cell < 27) {
            x = this.position.x; // reset x to the start position
            y += CELLHEIGHT * 6;
            y -= (cell - 23) * CELLHEIGHT; // subtract 1 from cell count
        } else if (cell >= 27 && cell < 33) {
            y = this.position.y; // reset y to the start position
            x += (cell - 27) * CELLWIDTH; // subtract 1 from cell count
        } else if (cell >= 33 && cell < 35) {
            x = this.position.x + CELLWIDTH * 6; // reset x to the start of the row
            y += (cell - 33) * CELLHEIGHT; // subtract 1 from cell count
        } else if (cell >= 35 && cell < 39) {
            y = this.position.y + CELLHEIGHT * 2; // reset y to the start of the column
            x -= (cell - 35) * CELLWIDTH; // subtract 1 from cell count
        }
        return { x, y };
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
function handleCellRedirection(cell) {
    console.log("io sono cella",cell);
 
    // Definizione delle condizioni per il reindirizzamento
    const redirectionConditions = {
        6: 'memory',
        11: 'cfs'
    };

    console.log("io sono redirection conditions [cell]",redirectionConditions[cell]);
    // Controlla se la cella corrente ha una condizione di reindirizzamento definita
    if (redirectionConditions.hasOwnProperty(cell)) {
        const game = redirectionConditions[cell];
        setTimeout(() => {
            socket.emit('redirectToGame',{ game: game, roomId: roomId });
        }, 1500); 
    }
}



// GESTIONE SOCKET
// prendiamo il parametro roomId dall'url per riconnettersi alla stanza
// i websocket (come socket.io) non sono persistenti tra pagine html diverse
// usiamo questo trucco per mantenere la connessione tra diverse pagine
const socket = io.connect('http://localhost:3000');

// prendiamo eventuali parametri di una chiamata GET
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');
let turnParam = urlParams.get('turn');
let winParam = urlParams.get('win'); 
let posFirstParam = urlParams.get('pos1');
let posSecondParam = urlParams.get('pos2');

// i due player si uniscono alla stanza
socket.emit('joinExistingRoom', roomId);
let turn;
let primaryPlayer = {};
let secondaryPlayer = {};
socket.on('yourTurn', (data) => {
    if (turnParam == null) {
        turn = data;
        primaryPlayer = new Player(turn);
        secondaryPlayer = new Player(!turn);
        appearTurn(turn);
    } else {
        primaryPlayer = new Player(!turnParam, Number(posFirstParam));
        secondaryPlayer = new Player(turnParam, Number(posSecondParam));
        appearTurn(turnParam);
    }
})

// se torniamo da un minigame, gestiamo opportunamente i parametri GET ottenuti
setTimeout(() => {
    if (winParam != null && winParam == 'true') {
        bonusTurn = true;
        bonusEvent(2);
    }
}, 500);


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
        // TODO controllare che il numero sia effettivamente randomico
        // e non preimpostato per una delle mille prove
        if (!number) dadoNumber = 10//Math.floor(Math.random() * 6) + 1;

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
// TODO TOGLIERE NUMBER
function movePlayer(player) {
    if (turn) {
        turn = false; 
        if (!player.isMoving) {
            player.isMoving = true;
            // utilizziamo uno schema di premessa/then per animare PRIMA il dado e POI restituire il numero
            rollDice(false).then(dadoNumber => {
                changeMusic(primaryPlayer.cell + dadoNumber);
                player.moveByCells(dadoNumber);

                socket.emit('requestMoveSecondaryPlayer', { dice: dadoNumber, roomId: roomId, special: false });

                // TODO: fixare questo! l'obiettivo è ritardare il turno quando c'è stato un evento bonus / penalità
                setTimeout(() => {
                    const checkIsMoving = setInterval(() => {
                        if (!player.isMoving) {
                            clearInterval(checkIsMoving);
                            socket.emit('requestChangeTurn', roomId);
                        }
                    }, 1000);
                }, 5000);
            }).catch(error => {
                console.log(error); 
            });
        }
    }
};

// gestione spostamento dell'altro giocatore
socket.on('moveSecondaryPlayer', (data) => {
    if (data.special) bonusTurn = false; 
    if ((!turn && !secondaryPlayer.ismoving) || data.special) {
        console.log('ora si muove il secondary')
        console.log(data.special)
        if (!data.special) rollDice(data.number);
        setTimeout(() => {
            secondaryPlayer.moveByCells(data.number);
        }, 600);
    }
})

// gestione assegnazione dei turni
socket.on('changeTurn', () => {
    turn = true;
    // compare scritta 'è il turno'
    if (primaryPlayer.cell != 39 && secondaryPlayer.cell != 39) appearTurn(turn);
});

// funzione che fa apparire la scritta con il proprio turno
function appearTurn(turn) {
    if (gameEnded) return;
    if (turn) {
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
}

function showFlipCard(cell) {
    const flipcard = document.querySelector('.flip-card');
    const flipcardfront = document.querySelector('.flip-card-front');
    const flipcardback = document.querySelector('.flip-card-back');
    if(cell == 30 ){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/minerva.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto!  Hai guardato la minerva negli occhi, vai indietro di 2 caselle.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            penaltyEvent(2);
        }, 6000);
    }
    else if(cell == 9){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/fisica.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto! Non hai passato l'esame di fisica, vai indietro di 2 caselle.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            penaltyEvent(2);
        }, 6000);
    }
    else if(cell == 38){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/tesi.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>IMPREVISTO</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Oh no, c'è stato un imprevisto! Devi scrivere la tesi, vai indietro di 3 caselle.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            penaltyEvent(3);
        }, 6000);
    }
    else if(cell == 3){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Hai superato un esonero, vai avanti di 2 caselle.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            bonusEvent(2);
        }, 6000);
    }
    else if(cell == 36){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Hai superato l'ultimo esame, vai avanti di 1 casella.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            bonusEvent(1);
        }, 6000);
    }
    else if(cell == 26){
        flipcard.style.visibility = 'visible';
        flipcard.style.opacity=1;
        flipcardfront.style.backgroundImage = `url('../images/relatore.png')`;
        flipcardfront.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1>`;
        flipcardback.innerHTML = `<h1 style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>BONUS</h1><p style='font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;'>Bravo! Sei riuscito a trovare un relatore per la tesi, vai avanti di 2 caselle.</p>`;
    
        setTimeout(() => {
            flipcard.style.opacity = '0';
        }, 5600);

        setTimeout(() => {
            flipcard.style.visibility = 'hidden';
            bonusTurn = true;
            bonusEvent(2);
        }, 6000);
    }
    else{
        flipcard.style.visibility='hidden';
    }
    
}

// gestione evento bonus (o vittoria minigame)
function bonusEvent(number) {
    if (!turn && bonusTurn) {
        primaryPlayer.isMoving = true;
        setTimeout(() => {
            primaryPlayer.moveByCells(number);
            socket.emit('requestMoveSecondaryPlayer', { dice: number, roomId: roomId, special: true });
            setTimeout(() => {
                primaryPlayer.isMoving = false;
            }, 1000);
        }, 500);
    }
};

// gestione evento imprevisto
function penaltyEvent(number) {
    if (!turn && bonusTurn) {
        primaryPlayer.isMoving = true;
        setTimeout(() => {
            primaryPlayer.moveByCells(-number);
            socket.emit('requestMoveSecondaryPlayer', { dice: -number, roomId: roomId, special: true });
            setTimeout(() => {
                primaryPlayer.isMoving = false;
            }, 1000);
        }, 500);
    }
};


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
    if(!gameEnded){
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
    }
        
    
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

socket.on('redirectToBothGame', (data) => {
    redirectPlayersToGame(data.game,data.roomId);
});

// Funzione per reindirizzare entrambi i giocatori al gioco specificato
function redirectPlayersToGame(game,data) {
    if (game === 'memory') {
        const nextPage = `/memory?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; // Reindirizza a Memory
    } else if (game === 'cfs') {
        const nextPage = `/cfs?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; // Reindirizza a CFS
    }
}






