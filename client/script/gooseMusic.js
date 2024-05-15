const backgroundMusic = document.getElementById("background-music");
const missionImpossible = document.getElementById("mission-impossible");
const muteButton = document.getElementById('muteButton');
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
window.addEventListener('load', () => { slowStart(backgroundMusic, 0.05); });

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
        if (missionImpossible.muted) {
            missionImpossible.muted = false;
            muteButton.style.backgroundImage="url('../images/speaker_11343708.png')";
        // se è smutata la mutiamo
        } else {
            missionImpossible.muted = true;
            muteButton.style.backgroundImage = "url('../images/mute-button_11343616.png')";
        }
    // se la canzone attiva è backgroundMusic
    } else {
        if (backgroundMusic.muted) {
            backgroundMusic.muted = false;
            muteButton.style.backgroundImage="url('../images/speaker_11343708.png')";
        } else {
            backgroundMusic.muted = true;
            muteButton.style.backgroundImage = "url('../images/mute-button_11343616.png')";
        }
    }
});

// esporto la variabile 'change' e la funzione 'changeMusic' da usare nel file .js principale
export { changeMusic, change };