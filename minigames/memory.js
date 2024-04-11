


var images=[
    "./analisi.png", 
    "./economia.png", 
    "./elettronica.png", 
    "./fisica.png", 
    "./geometria.png", 
    "./intartificiale.png", 
    "./probabilita.png", 
    "./programmazione.png", 
    "./sicurezza.png"
];

var gameBoard=document.getElementById('game-board');
var cards=[];
var flippedCards=[];
var matchedCards=[];
var currentPlayer=1;
var player1Pairs=0;
var player2Pairs=0;

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




function flipCard(){
    if(flippedCards.length<2 && !matchedCards.includes(this)){
        if (this.classList.contains('flipped')){
            return;
        }
        this.style.backgroundImage= 'url('+this.dataset.image+')';
        this.style.backgroundColor='#F2EFE9';
        flippedCards.push(this);
        this.classList.add('player'+ currentPlayer);

        if(flippedCards.length === 2){
            setTimeout(checkMatch, 1000);

        }
    }
}




function checkMatch(){
    var card1 = flippedCards[0];
    var card2 = flippedCards[1];

    

    if(card1.dataset.image === card2.dataset.image ){
        card1.style.boxShadow = getPlayerBoxShadowColor(currentPlayer);
        card2.style.boxShadow = getPlayerBoxShadowColor(currentPlayer);
        if(currentPlayer===1){
            card1.style.backgroundColor='#002c53';
            card2.style.backgroundColor='#002c53';
        }
        else{
            card1.style.backgroundColor='#548DBF';
            card2.style.backgroundColor='#548DBF';
        }
        
        matchedCards.push(card1, card2);
        updateScore();
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
        
        card1.classList.remove('player'+ currentPlayer);
        card2.classList.remove('player'+ currentPlayer);

        if(currentPlayer ===1){
            currentPlayer=2;

        }
        else{
            currentPlayer=1;
        }
    }  
    flippedCards=[];
}

function updateScore(){
    if(currentPlayer===1){
        player1Pairs++;
        document.getElementById('player1').textContent= 'Score: '+player1Pairs;

    }
    else{
        player2Pairs++;
        document.getElementById('player2').textContent= 'Score: '+player2Pairs;

    }
}

function getPlayerBoxShadowColor(player){
    if(player===1){
        return '5px 5px 20px #8C4A4A'
    }
    else{
        return '5px 5px 20px #696969'
    }

}

// Aggiungi questa funzione per mostrare l'avviso del vincitore
function showWinnerModal(winner) {
    var modal = document.getElementById('winner-modal');
    var winnerName = document.getElementById('winner-name');
    winnerName.textContent = winner;
    modal.style.display = 'block';
}

// Aggiungi questa funzione per nascondere l'avviso del vincitore
function hideWinnerModal() {
    var modal = document.getElementById('winner-modal');
    modal.style.display = 'none';
}


function checkGameEnd(){
    if(matchedCards.length === cards.length){
        var result;
        if(player1Pairs > player2Pairs){
            result='Player 1';
            /*window.alert(result);
            /*document.location.reload();*/
        }
        else if(player2Pairs > player1Pairs){
            result='Player 2';
            /*window.alert(result);
            /*document.location.reload();*/
        }
        showWinnerModal(result);
        /*document.location.reload();*/
            
    }   
    
}

// Aggiungi questo codice per gestire il click sull'icona di chiusura della finestra modale
document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideWinnerModal(); // Nascondi la finestra modale quando l'utente preme l'icona di chiusura
        });
    }
});



    


