const CELLWIDTH = 150;
const CELLHEIGHT = 100;
const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const c = canvas.getContext('2d');
const nameDiv = document.getElementById('playerName');
const bonusCells = [3, 9, 26, 30, 36, 38];

let gameEnded = false; // per distinguere disconnessione da vittoria
// flag e bonusTurn vengono usate per gestire i 'turni extra' cioè spostamenti al di fuori del proprio turno
let flag = false;
let bonusTurn = false;

// importazioni necessarie per la gestione della musica
import { changeMusic, change } from "./gooseMusic.js";
// importiamo la funzione per mostrare le flipcards ad entrambi i giocatori
import { showFlipCard} from "./gooseFlipcard.js";
// importiamo la funzione per mostrare i messaggi nella chat
import { renderMessage } from "./gooseChat.js";

// classe principale di un player
class Player {
    constructor(n, startingCell = 1) {
        this.turn = n;
        this.velocity = {x: 5, y: 5};
        this.isMoving = false;
        this.direction = 'x';
        this.cell = startingCell;

        const image = new Image();
        if (n) { image.src = '../images/rook.png'; this.type = 'rook'; }
        if (!n) { image.src = '../images/queen.png'; this.type = 'queen'; }
    
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
                    this.position.x = this.targetPosition.x = x; 
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
        checkFlagForRedirection (targetCell);
        this.isMoving = true;

        // caso base: siamo arrivati alla cella finale
        if (this.cell == targetCell) {
            this.cell = targetCell; 
            this.isMoving = false;
            handleCellRedirection(this.cell);
            // mostra la flipcard
            if (bonusCells.includes(this.cell)) bonusTurn = true;
            showFlipCard(this.cell);
            if (this == primaryPlayer) activeFlipCard(this.cell); 
            return;
        }

        // movimento in avanti
        if (this.cell < targetCell) { 
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
        // movimento indietro
        } else if (this.cell > targetCell) { 
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

        // audio di spostamento
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
        socket.emit('gameEnd',roomId);
    }

    calculatePosition(cell) {
        let x = this.position.x, y = this.position.y;
        if (cell >= 0 && cell < 9) {
            x += (cell - 1) * CELLWIDTH; 
        } else if (cell >= 9 && cell < 15) {
            x += CELLWIDTH * 8;
            y += (cell - 9) * CELLHEIGHT; 
        } else if (cell >= 15 && cell < 23) {
            y += CELLHEIGHT * 6;
            x += (23 - cell) * CELLWIDTH; 
        } else if (cell >= 23 && cell < 27) {
            y += CELLHEIGHT * 6;
            y -= (cell - 23) * CELLHEIGHT; 
        } else if (cell >= 27 && cell < 33) {
            y += CELLHEIGHT * 2;
            x += CELLWIDTH * 6;
            x -= (33 - cell) * CELLWIDTH;
        } else if (cell >= 33 && cell < 35) {
            x += CELLWIDTH * 6; 
            y += CELLHEIGHT * 4;
            y -= (35 - cell) * CELLHEIGHT; 
        } else if (cell >= 35 && cell < 39) {
            y += CELLHEIGHT * 4; 
            x += (41 - cell) * CELLWIDTH;
        }
        return { x, y };
    }
};

const hand = document.getElementById("hand");
// gestione del lancio del dado
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

                socket.emit('requestMoveSecondaryPlayer', { dice: dadoNumber, roomId: roomId, special: false });

                const checkIsMoving = setInterval(() => {
                    if (!player.isMoving) {
                        clearInterval(checkIsMoving);
                        socket.emit('requestChangeTurn', roomId);
                    }
                }, 1000);
            }).catch(error => {
                console.log(error); 
            });
        }
    }
};

/* GESTIONE SOCKET
prendiamo il parametro roomId dall'url per riconnettersi alla stanza
i websocket (come socket.io) non sono persistenti tra pagine html diverse
usiamo questo trucco per mantenere la connessione tra diverse pagine */
const socket = io.connect('http://localhost:3000');

/* il client inserisce l'username nei cookie in index.js
in questa porzione di codice, l'username viene recuperato dai cookie */
let username = '';
let secondaryUsername = '';
window.addEventListener('DOMContentLoaded', () => {
    /* evento che segnala l'unione alla stanza (sia la prima volta, sia dopo i minigame)
    viene integrato un piccolo timeout per evitare problemi con eventuali sfasamenti
    nei tempi di caricamenti dei browser */
    setTimeout(() => { socket.emit('joinExistingRoom', roomId); }, 50)

    const usernameCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('username='));
    username = usernameCookie ? usernameCookie.split('=')[1] : 'Utente';
    // per ottenere l'username dell'altro giocatore
    setTimeout(() => { socket.emit('requestOtherUsername', roomId) }, 1000);
    socket.on('otherUsername', (data) => { secondaryUsername = data; });
    // aggiorniamo il div, al rientro da un minigame, solo dopo che l'abbiamo ottenuto
    const getSecondaryUsername = setInterval (() => { 
        if (secondaryUsername != '') { 
            setFirst();
            clearInterval (getSecondaryUsername);
        }
    }, 500)
});

// prendiamo eventuali parametri di una chiamata GET
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');
let turnParam = null;
if (urlParams.has('turn')) { 
    turnParam = urlParams.get('turn');
    turnParam = (turnParam === 'true');
}
let winParam = null;
if (urlParams.has('win')) {
    winParam = urlParams.get('win');
    winParam = (winParam === 'true');
}
let posFirstParam = urlParams.get('pos1');
let posSecondParam = urlParams.get('pos2');

let turn;
let primaryPlayer = {};
let secondaryPlayer = {};
/* questo evento lanciato dal server gestisce l'assegnazione dei turni
sono presenti regole particolari nel caso in cui ci siano dei parametri
cioè nel caso in cui il client sta uscendo da un minigame */
socket.on('yourTurn', (data) => {
    if (turnParam == null) {
        turn = data;
        primaryPlayer = new Player(turn);
        secondaryPlayer = new Player(!turn);
        document.cookie = `primary=${turn}; path=/`;
        appearTurn(turn);
        /* all'inizio il div viene settato a 'pareggio'
           poi viene aggiornato ad ogni movimento
           se si rientra da un minigame viene aggiornato direttamente dalla porzione di codice in cui viene 
           preso il secondaryUsername */
        nameDiv.textContent = 'Pareggio';
    } else {
        turn = false;
        let primaryCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('primary='));
        let primary = primaryCookie.split('=')[1];
        primary = (primary === 'true');
        primaryPlayer = new Player(primary, Number(posFirstParam));
        secondaryPlayer = new Player(!primary, Number(posSecondParam));
    }
})

// esecuzione effettiva delle animazioni
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

// gestione dei turni + impostazione di nameDiv
function setFirst() {
    if (primaryPlayer.cell > secondaryPlayer.cell) {
        nameDiv.textContent = username;
    } else if (primaryPlayer.cell < secondaryPlayer.cell) {
        nameDiv.textContent = secondaryUsername;
    } else nameDiv.textContent = 'Pareggio';
};

// gestione reindirizzamento per minigame
function handleCellRedirection(cell) { 
    const redirectionConditions = {
        6: 'memory',
        28: 'memory',
        11: 'cfs',
        33: 'cfs',
        15: 'tris',
        19: 'hangman',
        23: 'pingpong',
    };
    // Controlla se la cella corrente ha una condizione di reindirizzamento definita
    if (redirectionConditions.hasOwnProperty(cell)) {
        const game = redirectionConditions[cell];
        setTimeout(() => {
            socket.emit('redirectToGame',{ game: game, roomId: roomId });
        }, 1600); 
    }
}

// questa porzione di codice serve a gestire l'assegnazione dei turni nelle diverse casistiche
// di vittoria, o meno, di minigame
window.addEventListener('DOMContentLoaded', () => {
    setTimeout( () => { 
        const intervalPlayers = setInterval(() => {
            if (primaryPlayer != {} && secondaryPlayer != {}) {
                clearInterval (intervalPlayers);
                if (winParam == null) return;
    
                // caso con vittoria del minigame
                else if (winParam) {
                    setTimeout(() => {
                        bonusEvent(2);
                    }, 100);
    
                    setTimeout(() => {
                        let actualCell = primaryPlayer.cell;
                        if (bonusCells.includes(actualCell)) {
                            // caso B in cui la vittoria del minigame fa finire in una cella con un bonus o un imprevisto
                            setTimeout(() => {
                                turn = turnParam;
                                appearTurn(turn);
                            }, 7000);
                        } else {
                            // caso C in cui la vittoria del minigame NON fa finire in una cella con un bonus o un imprevisto
                            setTimeout(() => {
                                turn = turnParam;
                                appearTurn(turn);
                            }, 500);
                        }
                    }, 2000);        
                } else if (!winParam) {
                    // caso A senza vittoria di un minigame
                    setTimeout(() => {
                        turn = turnParam;
                        appearTurn(turn);
                    }, 500);
                }
            }
        }, 500);
    }, 1000)
})

// gestione spostamento dell'altro giocatore
socket.on('moveSecondaryPlayer', (data) => {
    if ((!turn && !secondaryPlayer.ismoving) || data.special) {
        if (!data.special) rollDice(data.number);
        setTimeout(() => {
            secondaryPlayer.moveByCells(data.number);
        }, 600);
    }
})

// gestione assegnazione dei turni
socket.on('changeTurn', () => {
    if (primaryPlayer.cell != 39 && secondaryPlayer.cell != 39) {
        const intervalTurn = setInterval(() => {
            if (!bonusTurn) {
                turn = true;
                appearTurn(turn);
                clearInterval(intervalTurn);
            }
        }, 1000);
    }
});

// funzione che fa apparire la scritta con il proprio turno
function appearTurn(turn) {
    if (gameEnded) return;
    if (turn && !flag) {
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

/* gestione 'attiva' delle cards (cioè svolge effettivamente le azioni previste)
con funzioni per eventi bonus, cioè spostamenti al di fuori del proprio turno */
function activeFlipCard(cell) {
    if (cell == 30) {
        setTimeout(() => { penaltyEvent(3); }, 4000);
    } else if (cell == 9) {
        setTimeout(() => { penaltyEvent(2); }, 4000);
    } else if (cell == 38) {
        setTimeout(() => { penaltyEvent(3); }, 4000);
    } else if (cell == 3) {
        setTimeout(() => { bonusEvent(2); }, 4000);
    } else if (cell == 36) {
        setTimeout(() => { bonusEvent(1); }, 4000);
    } else if (cell == 26) {
        setTimeout(() => { bonusEvent(2); }, 4000);
    }
}

// gestione evento bonus (o vittoria minigame)
function bonusEvent(number) {
    if (!turn) {
        primaryPlayer.isMoving = true;
        bonusTurn = false;
        socket.emit('requestSetBonus', roomId);
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
    if (!turn) {
        primaryPlayer.isMoving = true;
        bonusTurn = false;
        socket.emit('requestSetBonus', roomId);
        setTimeout(() => {
            primaryPlayer.moveByCells(-number);
            socket.emit('requestMoveSecondaryPlayer', { dice: -number, roomId: roomId, special: true });
            setTimeout(() => {
                primaryPlayer.isMoving = false;
            }, 1000);
        }, 500);
    }
};

socket.on('setBonus', () => {
    bonusTurn = false;
});     

// gestione disconnessione forzata e vittoria
//caso di refresh della pagina
window.addEventListener('beforeunload',()=>{
    socket.emit('requestForcedDisconnect', roomId);
});
//caso di chiusura della pagina
window.addEventListener('unload', function(event) {
    socket.emit('requestForcedDisconnect', roomId);
});

socket.on('forcedDisconnect',()=>{
    if(!gameEnded && !flag){
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
});

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

// funzione per reindirizzare entrambi i giocatori al gioco specificato
function redirectPlayersToGame(game, data) {
    if (game === 'memory') {
        const nextPage = `/memory?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; 
    } else if (game === 'cfs') {
        const nextPage = `/cfs?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; 
    } else if(game == 'tris'){
        const nextPage = `/tris?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; 
    } else if(game == 'hangman'){
        const nextPage = `/hangman?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; 
    }
    else if(game === 'pingpong'){
        const nextPage = `/pingpong?room=${data}&pos1=${primaryPlayer.cell}&pos2=${secondaryPlayer.cell}&turn=${turn}`;
        window.location.href = nextPage; 
    }
};

function checkFlagForRedirection(cell) {
    if (cell == 6 || cell == 11 || cell == 15 || cell == 19|| cell == 23 || cell == 28 || cell == 33) flag = true;
};

// gestione logica pulsante lancio dado
button.addEventListener('animationend', () => {
    if (!isRolling && turn) movePlayer (primaryPlayer);
})

const MAX_WORD_LENGTH = 20; // Lunghezza massima di una parola

// Event listener per il click sul pulsante "Invia" per inviare un messaggio
document.querySelector(".chat-screen #send-message").addEventListener("click", function(){
    let message = document.querySelector(".chat-screen #message-input").value; // Recupera il testo del messaggio
    const words = message.split(' ');

    // Controllo della lunghezza delle parole
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > MAX_WORD_LENGTH) {
            alert(`Una delle parole è troppo lunga! Limita le parole a una lunghezza di ${MAX_WORD_LENGTH} caratteri.`);
            return;
        }
    }
    if(message.length == 0) return; // Se il messaggio è vuoto, non fare nulla

    renderMessage("my", { // Chiama la funzione renderMessage per renderizzare il messaggio inviato dall'utente
        username: secondaryUsername, //in realtà è inutile username:othername (dopo nell'html uso direttamente le due viarabili)
        text: message 
    }, username, secondaryUsername);

    socket.emit("chat", { // Emetti un evento "chat" attraverso la socket per inviare il messaggio al server
        username: secondaryUsername, // Nome utente dell'altro utente come mittente del messaggio
        text: message // Testo del messaggio
    }, username, secondaryUsername);
    document.querySelector(".chat-screen #message-input").value = ""; // Svuota il campo di input del messaggio
});

// Ascolta l'evento "update" dalla socket e chiama la funzione renderMessage per renderizzare l'aggiornamento
socket.on("update", function(update){
    renderMessage("update", update, username, secondaryUsername); // Chiama la funzione renderMessage per renderizzare l'aggiornamento
});

// Ascolta l'evento "chat" dalla socket e chiama la funzione renderMessage per renderizzare il messaggio ricevuto
socket.on("chat", function(message) {
    console.log(secondaryUsername)
    renderMessage("other", message, username, secondaryUsername); // Chiama la funzione renderMessage per renderizzare il messaggio ricevuto
});


