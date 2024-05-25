const backgroundMusic = document.getElementById("background-music");
const missionImpossible = document.getElementById("mission-impossible");
const muteButton = document.getElementById("muteButton");
const rollDiceSound = document.getElementById("dice-roll");
const pieceMoveSound = document.getElementById("piece-move");
let change = false;

// l'audio 'music' viene fatto partire con un incremento 'increment' ogni due secondi
function slowStart (music, increment) {
    music.volume = 0.1;
    music.play();
    const fadeInterval = setInterval(() => {
        if (music.volume < 1) music.volume += increment;
        if (music.volume >= 0.9) clearInterval(fadeInterval);
    }, 2000);
}

// quando la finestra si carica, parte la musica (col volume basso) e piano piano aumneta
window.addEventListener('DOMContentLoaded', () => { 
    slowStart(backgroundMusic, 0.01); 
    /* se esiste un cookie con chiave primaria mute, ne esaminiamo le valore:
    se è true, mutiamo l'audio al rientro */
    let muteCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('mute'));
    if (muteCookie) {
        let muteValue = muteCookie.split('=')[1];
        if (muteValue == 'true') {
            if (change) mute(missionImpossible);
            else mute(backgroundMusic);
        }
    }  
});

// fuznione per cambiare la musica da quella normale di sottofondo a 'missionImpossible'
function changeMusic(cell) {
    if (!change && cell >= 27) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        slowStart(missionImpossible, 0.1);
        change = true;
        // se la precedente è mutata, muto anche missionImpossible
        if (backgroundMusic.muted) missionImpossible.muted = true;
    } else if (change && cell < 30) {
        missionImpossible.pause();;
        missionImpossible.currentTime = 0;
        slowStart(backgroundMusic, 0.1);
        change = false;
    }
}

// gestione del pulsante per mutare
muteButton.addEventListener('click', function() {
    // se la canzone attiva è mission impossible
    if (change) {
        // se è mutata la smutiamo
        if (missionImpossible.muted) smute(missionImpossible);
        // se è smutata la mutiamo
        else mute(missionImpossible);
    // se la canzone attiva è backgroundMusic
    } else {
        // stessa cosa di prima
        if (backgroundMusic.muted) smute (backgroundMusic);
        else mute (backgroundMusic);
    }
});

function smute(audio) {
    audio.muted = false;
    muteButton.style.backgroundImage="url('../images/speaker_11343708.png')";
    rollDiceSound.volume = 0.5;
    pieceMoveSound.volume = 0.5;
    document.cookie = `mute=false; path=/`;
}

function mute(audio) {
    audio.muted = true;
    muteButton.style.backgroundImage = "url('../images/mute-button_11343616.png')";
    rollDiceSound.volume = 0;
    pieceMoveSound.volume = 0;
    document.cookie = `mute=true; path=/`;
}


// esporto le funzioni da usare nel file principale
export { changeMusic };