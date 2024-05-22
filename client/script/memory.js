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

//vengono create le 18 carte (inserite in un array) a cui viene legato un eventolistener quando viene cliccata
for(let i=0; i<18; i++){
    let card = document.createElement('div');
    card.className='card';
    card.dataset.image=images[Math.floor(i/2)];
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
    cards.push(card);
}
shuffleCards();

//funzione per mescolare le carte
function shuffleCards(){
    for(let i=cards.length -1; i>0; i--){
        let j = Math.floor(Math.random()*(i+1));
        //le immagini della carta i e j vengono scambiate 
        let temp =cards[i].dataset.image;
        cards[i].dataset.image=cards[j].dataset.image;
        cards[j].dataset.image=temp;
    }
}
let canFlip=true;

//Funzione per la gestione della rivelazione delle carte
function flipCard(){
    //se non è possibile girare le carte, se ci sono già due carte girate, se la carta è già stata girata o se la partita è finita, la funzione non fa nulla
    if (!canFlip || flippedCards.length >= 2 || matchedCards.includes(this)|| flippedCards.includes(this)|| gameOver) {
        return;
    }

    if(flippedCards.length<2 && !matchedCards.includes(this)){
        if (this.classList.contains('flipped')){
            return;
        }
        //viene girata la carta e mostrata l'immagine e la carta viene aggiunta all'array delle carte girate
        this.style.backgroundImage= 'url('+this.dataset.image+')';
        this.style.backgroundColor='#F2EFE9';
        flippedCards.push(this);

        if(flippedCards.length === 2){
            canFlip = false;
            setTimeout(function() {
                canFlip = true; //reimposta la possibilità di girare le carte dopo un certo periodo di tempo
            }, 1600);
            setTimeout(checkMatch, 900); 
        }
    }
}

//funzione per controllare se le carte girate sono uguali
function checkMatch(){
    let card1 = flippedCards[0];
    let card2 = flippedCards[1];

    //se le carte girate hanno la stessa immagine vengono aggiunte nell'array matchedCards
    if(card1.dataset.image === card2.dataset.image ){
        card1.style.backgroundColor='#548DBF';
        card2.style.backgroundColor='#548DBF';
        matchedCards.push(card1, card2);
        //quando si trovano carte uguali viene controllato se la partita è finita
        checkGameEnd();
    }
    //se le carte non sono uguali vengono nuovamente girate dopo l'animazione shake
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

//funzione per mostrare il modale di fine partita
function showEndGameModal() {
    let modal = document.getElementById('end-game-modal');
    modal.style.display = 'block';
}

//funzione per nascondere il modale di fine partita
function hideEndGameModal() {
    let modal = document.getElementById('end-game-modal');
    modal.style.display = 'none';
}

//gestione del click sull'icona di chiusura del modale
document.addEventListener('DOMContentLoaded', function() {
    let closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideEndGameModal(); //nascondi il modale quando l'utente fa clic sull'icona di chiusura
        });
    }
});

//funzione per gestire la fine della partita quando tutte le coppie sono state trovate
function checkGameEnd() {
    //quando sono state trovate tutte le coppie viene mostrato il modale di fine partita e viene disabilitata la possibilità di girare le carte
    if(matchedCards.length === cards.length){
        showEndGameModal();
        canFlip = false;
        gameOver=true;
        playerOne=1;
    } 
}

//funzione per il reindirizzamento alla pagina goose dopo la fine della partita
function endGame() {
    socket.emit('quitGame', { roomId: roomId, 
        primaryPlayerPosition: primaryPosition,
        secondaryPlayerPosition: secondaryPosition,
        win: (playerOne == 1), 
        turn: turn 
    });
}

//funzione per avviare il timer
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

//funzione per avviare il timer con una durata di 1 minuto
function startGameTimer() {
    let oneMinutes = 60,
    display = document.querySelector('#timer');
    startTimer(oneMinutes, display);
    updateTimerBar(oneMinutes);
}

function updateTimerBar(duration) {
    var timerBar = document.querySelector('#timerBar');
    timerBar.style.animationDuration = duration + 's'; //imposta la durata dell'animazione
}

//avvia il timer quando la finestra si carica
window.onload = function () {
    startGameTimer();
};

//GESTIONE SERVER
const urlParams = new URLSearchParams(window.location.search);
//prendo i parametri passati tramite chiamata GET
const roomId = urlParams.get('room');
const primaryPosition = urlParams.get('pos1');
const secondaryPosition = urlParams.get('pos2')
const turn = urlParams.get('turn');
const socket = io.connect('http://localhost:3000');

//Gestione del click sull'icona di chiusura del modale
document.addEventListener('DOMContentLoaded', () => {
    socket.emit("joinExistingRoom",roomId);
});

//i giocatori vengono reindirizzati a goose
socket.on('redirect', (data) => {
    window.location.href = data;
});