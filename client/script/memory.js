var images=[
    "../images/analisi.png", 
    "../images/economia.png", 
    "../images/elettronica.png", 
    "../images/fisica.png", 
    "../images/geometria.png", 
    "../images/intartificiale.png", 
    "../images/probabilita.png", 
    "../images/programmazione.png", 
    "../images/sicurezza.png"
];

let gameBoard=document.getElementById('game-board');
let cards=[];
let flippedCards=[];
let matchedCards=[];
let gameOver=false;
let playerOne=0;
let playerTwo=0;

//Vengono create le 18 carte (inserite in un array) a cui viene legato un eventolistener quando viene cliccata
for(let i=0; i<18; i++){
    let card = document.createElement('div');
    card.className='card';
    card.dataset.image=images[Math.floor(i/2)];
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
    cards.push(card);
}
shuffleCards();

//Funzione per mescolare le carte
function shuffleCards(){
    for(let i=cards.length -1; i>0; i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp =cards[i].dataset.image;
        cards[i].dataset.image=cards[j].dataset.image;
        cards[j].dataset.image=temp;
    }
}
let canFlip=true;

//Funzione per la gestione della rivelazione delle carte
function flipCard(){
    if (!canFlip || flippedCards.length >= 2 || matchedCards.includes(this)|| flippedCards.includes(this)|| gameOver) {
        return;
    }

    if(flippedCards.length<2 && !matchedCards.includes(this)){
        if (this.classList.contains('flipped')){
            return;
        }
        this.style.backgroundImage= 'url('+this.dataset.image+')';
        this.style.backgroundColor='#F2EFE9';
        flippedCards.push(this);

        if(flippedCards.length === 2){
            canFlip = false;
            setTimeout(function() {
                canFlip = true; // Reimposta la possibilità di girare le carte dopo un certo periodo di tempo
            }, 1600);
            setTimeout(checkMatch, 900); 


        }
    }
}

//Funzione per controllare se le carte girate sono uguali
function checkMatch(){
    let card1 = flippedCards[0];
    let card2 = flippedCards[1];

    if(card1.dataset.image === card2.dataset.image ){
        card1.style.backgroundColor='#548DBF';
        card2.style.backgroundColor='#548DBF';
        matchedCards.push(card1, card2);
        checkGameEnd();
    }
    //Se le carte non sono uguali vengono nuovamente girate dopo l'animazione 
    else{
        card1.classList.add('shake');
        card2.classList.add('shake');
        setTimeout(function() {
            card1.classList.remove('shake');
            card2.classList.remove('shake');
            card1.style.backgroundImage='';
            card2.style.backgroundImage='';
            card1.style.backgroundColor='#8C4A4A';
            card2.style.backgroundColor='#8C4A4A'
        }, 700);
    }  
    flippedCards=[];
}

let interval;

//Funzione per mostrare il modale di fine partita
function showEndGameModal() {
    let modal = document.getElementById('end-game-modal');
    modal.style.display = 'block';
}

//Funzione per nascondere il modale di fine partita
function hideEndGameModal() {
    let modal = document.getElementById('end-game-modal');
    modal.style.display = 'none';
}

//Gestione del click sull'icona di chiusura del modale
document.addEventListener('DOMContentLoaded', function() {
    let closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideEndGameModal(); // Nascondi il modale quando l'utente fa clic sull'icona di chiusura
        });
    }
});

//Funzione per gestire la fine della partita quando tutte le coppie sono state trovate o il timer è scaduto
function checkGameEnd() {
    if(matchedCards.length === cards.length){
        showEndGameModal();
        canFlip = false;
        gameOver=true;
        playerOne=1;
    }
    
    
}

function endGame() {
    socket.emit('quitGame', { roomId: roomId, 
        primaryPlayerPosition: primaryPosition,
        secondaryPlayerPosition: secondaryPosition,
        win: (playerOne == 1), 
        turn: turn 
    });
}

//Funzione per avviare il timer
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;


        if (--timer < 0) {
            clearInterval(interval);
            endGame(); 
        }
    }, 1000);
}

// Funzione per avviare il timer con una durata di 2 minuti (120 secondi)
function startGameTimer() {
    let oneMinutes = 2,
    display = document.querySelector('#timer');
    startTimer(oneMinutes, display);
    updateTimerBar(oneMinutes);
}

function updateTimerBar(duration) {
    var timerBar = document.querySelector('#timerBar');
    timerBar.style.animationDuration = duration + 's'; // Imposta la durata dell'animazione
}

//Avvia il timer quando la finestra si carica
window.onload = function () {
    startGameTimer();
};



//GESTIONE SERVER
const urlParams = new URLSearchParams(window.location.search);
//Prendo i parametri passati tramite chiamata GET
const roomId = urlParams.get('room');
const primaryPosition = urlParams.get('pos1');
const secondaryPosition = urlParams.get('pos2')
const turn = urlParams.get('turn');
const socket = io.connect('http://localhost:3000');


socket.emit("joinExistingRoom",roomId);

//I giocatori vengono reindirizzati a goose
socket.on('redirect', (data) => {
    window.location.href = data;
});