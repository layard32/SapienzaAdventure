// funzione per generare un numero randomico
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

// prendo gli elementi dal dom HTML
const rect = document.querySelector(".rect");
const startGameButton = rect.querySelector(".start-game");
const joinGameButton = rect.querySelector(".join-game");

// creo gli elementi da integrare nel DOM
// questi elementi appaiono quando si clicca il bottone start game o join game
// ne imposto anche il textContent (per evitare problemi poi con l'append)
// preferisco usare textContent al posto di innerHTML per motivi di sicurezza
const goBackButton1 = document.createElement("button"); // tasto per tornare indietro (da startGame)
goBackButton1.textContent = "Torna indietro";
const goBackButton2 = document.createElement("button"); // tasto per tornare indietro (da joinGame)
goBackButton2.textContent = "Torna indietro";

const roomCode = document.createElement("div"); // codice della stanza
roomCode.textContent = "Il codice della tua stanza è:";

const loader = document.createElement("div");

const roomCodeNumber = document.createElement("span"); // span contenente numero randomico, che aggiungo come figlio a roomCode
roomCodeNumber.textContent = generateRandomNumber();
roomCode.appendChild(roomCodeNumber);

const insertCodeForm = document.createElement("form"); // form per inserire il codice
const insertCodeInput = document.createElement("input"); // input per inserire il codice il form
const insertCodeLabel = document.createElement("label"); // label associato all'input
insertCodeLabel.textContent = "Inserisci il codice della stanza:";
const confirmJoinButton = document.createElement("button"); // tasto per confermare l'entrata nella stanza (in join game)
confirmJoinButton.textContent = "Unisciti alla stanza";
const joinContainer = document.createElement("div"); // metto il submit e goback button dentro un flexbox container
joinContainer.appendChild(goBackButton2);
joinContainer.appendChild(confirmJoinButton);
insertCodeLabel.appendChild(insertCodeInput);
insertCodeForm.appendChild(insertCodeLabel);
insertCodeForm.appendChild(joinContainer);

// setto le classi, gli id ed eventuali attributi degli elementi creati
goBackButton1.classList.add("btn", "text");
goBackButton2.classList.add("btn", "text");
goBackButton2.setAttribute("type", "button");
confirmJoinButton.classList.add("btn", "text");
roomCode.classList.add("text");
roomCode.id = "roomCode";
roomCodeNumber.classList.add("text");
roomCodeNumber.id = "randomNumber";
loader.classList.add("loader", "text");
joinContainer.id = "joinContainer";
insertCodeInput.id = "inputCode";
insertCodeInput.classList.add("text");
insertCodeInput.setAttribute("pattern", "[0-9]+");
insertCodeInput.setAttribute("title", "Solamente numeri");
insertCodeInput.setAttribute("required", "");
insertCodeInput.setAttribute("maxlength", "4");
insertCodeLabel.classList.add("text");
insertCodeLabel.id = "roomJoinLabel";
insertCodeLabel.setAttribute("for", "inputCode");
confirmJoinButton.setAttribute("type", "submit");
confirmJoinButton.setAttribute("value", "Unisciti")
insertCodeForm.id = "codeForm";

// funzione per rimuovere gli elementi dal DOM con una transizione di trasparenza
// questo effetto viene ottenuto mediante le proprietà opacity e transition di CSS
const removeElements =  function (elems) {
    for (const elem of elems) {
        // transizione a scomparsa 
        elem.style.transition = "opacity 0.5s";
        elem.style.opacity = 0;
        // rimozione effettiva dal DOM
        setTimeout( () => {
            elem.remove();
            console.log("elemento rimosso");        
        }, 500);
    }
};

// funzione per aggiungere gli elementi all'elemento parent con una transizione di trasparenza (stesso meccanismo della precedente)
const addElements = function (elems, parent) {
    for (const elem of elems) {
        // transizione a comparsa
        elem.style.transition = "opacity 0.5s";
        elem.style.opacity = 0;
        // aggiunta effettiva al DOM (impostando opacity = 1)
        setTimeout( () => {
            parent.appendChild(elem);
            elem.style.opacity = 1;
        }, 500);
    }
};

startGameButton.addEventListener("click", () => {
    removeElements ([startGameButton, joinGameButton]);
    addElements ([roomCode, loader, goBackButton1], rect);
});

joinGameButton.addEventListener("click", () => {
    removeElements ([startGameButton, joinGameButton]);
    addElements ([insertCodeForm], rect);
});

// startGame.addEventListener("click", () => {
//     // preparo gli elementi alla rimozione, con una transazione sull'opacità
//     startGame.style.transition = "opacity 0.5s"; 
//     joinGame.style.transition = "opacity 0.5s";
//     startGame.style.opacity = 0;
//     joinGame.style.opacity = 0;  

//     // li rimuovo effettivamente ed aggiungo il pulsante per tornare indietro, ma opacizzato a 0 (stessa cosa per il div con il codice ed il loader)
//     setTimeout( () => {
//         startGame.remove();
//         joinGame.remove();
        
//         rect.appendChild(roomCode);
//         rect.appendChild(loader);
//         rect.appendChild(goBack);

//         goBack.style.opacity = 0;
//         roomCode.style.opacity = 0;
//         loader.style.opacity = 0;

//         // imposto il display di rect con flex-direction pari a column e 
//         rect.style.flexDirection = "column";
//         rect.style.justifyContent = "space-around";

//         // imposto il codice randomico calcolato tramite l'apposita funzione
//         randomNumberSpan.textContent = generateRandomNumber();
//     }, 500);

//     // faccio comparire il pulsante (insieme al div con il codice ed il loader) con una transizione dell'opacità
//     setTimeout(() => {
//         roomCode.style.transition = "opacity 0.5s";
//         roomCode.style.opacity = 1;
//         goBack.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
//         goBack.style.opacity = 1;
//         loader.style.transition = "opacity 0.5s";
//         loader.style.opacity = 1;
//     }, 600);
// });

// joinGame.addEventListener("click", () => {
//     // preparo gli elementi alla rimozione, con una transazione sull'opacità
//     startGame.style.transition = "opacity 0.5s"; 
//     joinGame.style.transition = "opacity 0.5s";
//     startGame.style.opacity = 0;
//     joinGame.style.opacity = 0;

//     // li rimuovo effettivamente ed aggiungo il pulsante per tornare indietro, ma opacizzato a 0 (stessa cosa per il div con il codice ed il loader)
//     setTimeout( () => {
//         startGame.remove();
//         joinGame.remove();
        
//         rect.appendChild(labelCode);
//         rect.appendChild(joinContainer);

//         joinContainer.style.opacity = 0;
//         roomCode.style.opacity = 0;
//         loader.style.opacity = 0;

//         // imposto il display di rect cambiando flex direction e justify content
//         rect.style.flexDirection = "column";
//         rect.style.justifyContent = "space-around";

//         // imposto il codice randomico calcolato tramite l'apposita funzione
//         randomNumberSpan.textContent = generateRandomNumber();
//     }, 500);

//     // faccio comparire il pulsante (insieme al div con il codice ed il loader) con una transizione dell'opacità
//     setTimeout(() => {
//         labelCode.style.transition = "opacity 0.5s";
//         labelCode.style.opacity = 1;
//         joinContainer.style.transition = "opacity 0.5s";
//         joinContainer.style.opacity = 1;
//     }, 600);
// });

// // PER ORA RIMUOVO TUTTO QUANTO NEL GOBACK!!! MIGLIORARE IL CODICE
// goBack.addEventListener("click", () => {
//     // preparo gli elementi alla rimozione, con una transazione sull'opacità
//     goBack.style.transition = "opacity 0.5s"; 
//     roomCode.style.transition = "opacity 0.5s";
//     loader.style.transition = "opacity 0.5s";
//     labelCode.style.transition = "opacity 0.5s";
//     joinContainer.style.transition = "opacity 0.5s";
//     goBack.style.opacity = 0;
//     roomCode.style.opacity = 0;
//     loader.style.opacity = 0;
//     labelCode.style.opacity = 0;
//     inputCode.value = '';

//     // li rimuovo effettivamente, aggiungendo, opacizzati a zero (per la transizione) gli elementi precedenti (stessa cosa per div del codice e loader)
//     setTimeout( () => {
//         goBack.remove();
//         roomCode.remove();
//         loader.remove();
//         labelCode.remove();
//         joinContainer.remove();

//         rect.appendChild(startGame);
//         rect.appendChild(joinGame);
//         joinGame.style.opacity = 0;
//         startGame.style.opacity = 0;
    
//         // imposto rect come prima
//         rect.style.flexDirection = "row";
//         rect.style.justifyContent = "center";
//         }, 500);

//     // faccio ricomparire gli elementi precedenti con una transizione
//     setTimeout(() => {
//         joinGame.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
//         joinGame.style.opacity = 1;
//         startGame.style.transition = "opacity 0.5s transform 0.2s, box-shadow 0.2s";
//         startGame.style.opacity = 1;
//     }, 600);
// });