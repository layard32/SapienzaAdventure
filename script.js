// funzione per generare un numero randomico
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

// prendo il rettangolo al centro dell'home-page
const rect = document.querySelector(".rect");

// a partire dal quale prendo i due pulsanti
const startGame = rect.querySelector(".start-game");
const joinGame = rect.querySelector(".join-game");

// creo in anticipo il bottone per tornare indietro, a cui associo una classe ed un testo
const goBack = document.createElement("button");
goBack.classList.add("btn", "goBack", "text");
goBack.textContent = "Torna indietro";

// creo in anticipo il div con il numero, calcolato randomicamente, della stanza e gli associo una classe
const roomCode = document.createElement("div");
roomCode.classList.add("roomCode", "text");
roomCode.textContent = "Il codice della tua stanza è:";
const randomNumberSpan = document.createElement("span");
randomNumberSpan.classList.add("randomNumber", "text")
roomCode.appendChild(randomNumberSpan);

// creo in anticipo il loader
const loader = document.createElement("div");
loader.classList.add("loader", "text");

// creo in anticipo un input per inserire il codice della stanza con label
const inputCode = document.createElement("input");
inputCode.classList.add("roomJoin", "text");
inputCode.setAttribute("type", "text"); // Imposta il tipo dell'input su "text"
const labelCode = document.createElement("label");
labelCode.classList.add("roomJoinLabel", "text");
labelCode.setAttribute("for", "inputCode");
labelCode.textContent = "Inserisci il codice della stanza:";
labelCode.appendChild(inputCode);

startGame.addEventListener("click", () => {
    // preparo gli elementi alla rimozione, con una transazione sull'opacità
    startGame.style.transition = "opacity 0.5s"; 
    joinGame.style.transition = "opacity 0.5s";
    startGame.style.opacity = 0;
    joinGame.style.opacity = 0;

    // li rimuovo effettivamente ed aggiungo il pulsante per tornare indietro, ma opacizzato a 0 (stessa cosa per il div con il codice ed il loader)
    setTimeout( () => {
        startGame.remove();
        joinGame.remove();
        
        rect.appendChild(roomCode);
        rect.appendChild(loader);
        rect.appendChild(goBack);

        goBack.style.opacity = 0;
        roomCode.style.opacity = 0;
        loader.style.opacity = 0;

        // imposto il display di rect con flex-direction pari a column e 
        rect.style.flexDirection = "column";
        rect.style.justifyContent = "space-around";

        // imposto il codice randomico calcolato tramite l'apposita funzione
        randomNumberSpan.textContent = generateRandomNumber();
    }, 500);

    // faccio comparire il pulsante (insieme al div con il codice ed il loader) con una transizione dell'opacità
    setTimeout(() => {
        roomCode.style.transition = "opacity 0.5s";
        roomCode.style.opacity = 1;
        goBack.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
        goBack.style.opacity = 1;
        loader.style.transition = "opacity 0.5s";
        loader.style.opacity = 1;
    }, 600);
});

joinGame.addEventListener("click", () => {
    // preparo gli elementi alla rimozione, con una transazione sull'opacità
    startGame.style.transition = "opacity 0.5s"; 
    joinGame.style.transition = "opacity 0.5s";
    startGame.style.opacity = 0;
    joinGame.style.opacity = 0;

    // li rimuovo effettivamente ed aggiungo il pulsante per tornare indietro, ma opacizzato a 0 (stessa cosa per il div con il codice ed il loader)
    setTimeout( () => {
        startGame.remove();
        joinGame.remove();
        
        rect.appendChild(labelCode);
        rect.appendChild(goBack);

        goBack.style.opacity = 0;
        roomCode.style.opacity = 0;
        loader.style.opacity = 0;

        // imposto il display di rect con flex-direction pari a column e 
        rect.style.flexDirection = "column";
        rect.style.justifyContent = "space-around";

        // imposto il codice randomico calcolato tramite l'apposita funzione
        randomNumberSpan.textContent = generateRandomNumber();
    }, 500);

    // faccio comparire il pulsante (insieme al div con il codice ed il loader) con una transizione dell'opacità
    setTimeout(() => {
        labelCode.style.transition = "opacity 0.5s";
        labelCode.style.opacity = 1;
        goBack.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
        goBack.style.opacity = 1;
    }, 600);
});

// PER ORA RIMUOVO TUTTO QUANTO NEL GOBACK!!! MIGLIORARE IL CODICE
goBack.addEventListener("click", () => {
    // preparo gli elementi alla rimozione, con una transazione sull'opacità
    goBack.style.transition = "opacity 0.5s"; 
    roomCode.style.transition = "opacity 0.5s";
    loader.style.transition = "opacity 0.5s";
    labelCode.style.transition = "opacity 0.5s";
    goBack.style.opacity = 0;
    roomCode.style.opacity = 0;
    loader.style.opacity = 0;
    labelCode.style.opacity = 0;

    // li rimuovo effettivamente, aggiungendo, opacizzati a zero (per la transizione) gli elementi precedenti (stessa cosa per div del codice e loader)
    setTimeout( () => {
        goBack.remove();
        roomCode.remove();
        loader.remove();
        labelCode.remove();

        rect.appendChild(startGame);
        rect.appendChild(joinGame);
        joinGame.style.opacity = 0;
        startGame.style.opacity = 0;
    
        // imposto rect come prima
        rect.style.flexDirection = "row";
        rect.style.justifyContent = "center";
        }, 500);

    // faccio ricomparire gli elementi precedenti con una transizione
    setTimeout(() => {
        joinGame.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
        joinGame.style.opacity = 1;
        startGame.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
        startGame.style.opacity = 1;
    }, 600);
});