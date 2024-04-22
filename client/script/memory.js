


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

var gameBoard=document.getElementById('game-board');
var cards=[];
var flippedCards=[];
var matchedCards=[];
var gameOver=false;




/*vengono create le 18 carte (inserite in un array) a cui viene legato un eventolistener quando viene cliccata*/
for(var i=0; i<18; i++){
    var card = document.createElement('div');
    card.className='card';
    card.dataset.image=images[Math.floor(i/2)];
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
    cards.push(card);


}
shuffleCards();

/*vengono mescolate le carte */
function shuffleCards(){
    for(var i=cards.length -1; i>0; i--){
        var j = Math.floor(Math.random()*(i+1));
        var temp =cards[i].dataset.image;
        cards[i].dataset.image=cards[j].dataset.image;
        cards[j].dataset.image=temp;
    }
}

var canFlip=true;

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
        /*this.classList.add('player'+ currentPlayer);*/

        if(flippedCards.length === 2){
            canFlip = false;
            setTimeout(function() {
                canFlip = true; // Reimposta la possibilità di girare le carte dopo un certo periodo di tempo
            }, 1600);
            setTimeout(checkMatch, 900); //


        }
    }
}




function checkMatch(){
    var card1 = flippedCards[0];
    var card2 = flippedCards[1];

    

    if(card1.dataset.image === card2.dataset.image ){
        card1.style.backgroundColor='#548DBF';
        card2.style.backgroundColor='#548DBF';
        matchedCards.push(card1, card2);
        /*updateScore();*/
        checkGameEnd();

    }
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
        }, 700); // Tempo in millisecondi per l'animazione
        
        
    }  
    flippedCards=[];
}



var interval; // Dichiarazione globale della variabile interval

// Funzione per mostrare il modale di fine partita
function showEndGameModal() {
    var modal = document.getElementById('end-game-modal');
    modal.style.display = 'block';
}

// Funzione per nascondere il modale di fine partita
function hideEndGameModal() {
    var modal = document.getElementById('end-game-modal');
    modal.style.display = 'none';
}

// Funzione per controllare la fine della partita
function checkGameEnd() {
    var timerDisplay = document.querySelector('#timer');
    var timerValue = timerDisplay.textContent;
    
        // Se il timer è scaduto o tutte le coppie sono state trovate
    if (timerValue === "00:00" || matchedCards.length === cards.length) {
        clearInterval(interval); // Ferma il timer
    
            // Mostra il modale della fine della partita
        showEndGameModal();
    
        // Disabilita la funzionalità di girare le carte
        canFlip = false;
    }
    
    
}

// Gestione del click sull'icona di chiusura del modale
document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideEndGameModal(); // Nascondi il modale quando l'utente fa clic sull'icona di chiusura
        });
    }
});

// Funzione per avviare il timer
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            checkGameEnd(); // Controlla la fine della partita quando il timer arriva a zero
        }
    }, 1000);
}


// Funzione per avviare il timer con una durata di 3 minuti (180 secondi)
function startGameTimer() {
    var threeMinutes = 60 * 3,
        display = document.querySelector('#timer');
    startTimer(threeMinutes, display);
}

// Avvia il timer quando la finestra si carica
window.onload = function () {
    startGameTimer();
};





