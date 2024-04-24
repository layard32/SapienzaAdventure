// prendo gli elementi dal dom HTML
const rect = document.querySelector(".rect");
const basicButton = rect.querySelector("#basicButton");
const startGameButton = rect.querySelector(".start-game");
const joinGameButton = rect.querySelector(".join-game");
const usernameForm = rect.querySelector("#usernameForm");
const usernameFormInput = document.querySelector("#usernameFormInput");
const submitButton = document.querySelector(".my-btn.text");

// setto prelinarmente l'username a stringa vuota
let username = String();

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
roomCode.appendChild(roomCodeNumber);

const insertCodeForm = document.createElement("form"); // form per inserire il codice
const insertCodeInput = document.createElement("input"); // input per inserire il codice il form
const insertCodeLabel = document.createElement("label"); // label associato all'input
insertCodeLabel.textContent = "Inserisci il codice della stanza:";
const confirmJoinButton = document.createElement("button"); // tasto per confermare l'entrata nella stanza (in join game)
confirmJoinButton.textContent = "Unisciti alla stanza";
const joinContainer = document.createElement("div"); // metto il submit e goback my-btn dentro un flexbox container
joinContainer.appendChild(goBackButton2);
joinContainer.appendChild(confirmJoinButton);
insertCodeLabel.appendChild(insertCodeInput);
insertCodeForm.appendChild(insertCodeLabel);
insertCodeForm.appendChild(joinContainer);

// setto le classi, gli id ed eventuali attributi degli elementi creati
goBackButton1.classList.add("my-btn", "text", "primary");
goBackButton2.classList.add("my-btn", "text", "primary");
goBackButton2.setAttribute("type", "button");
confirmJoinButton.classList.add("my-btn", "text", "primary");
roomCode.classList.add("text");
roomCode.id = "roomCode";
roomCodeNumber.classList.add("text");
roomCodeNumber.id = "randomNumber";
loader.classList.add("loader", "text");
joinContainer.id = "joinContainer";
insertCodeInput.classList.add("text", "inputCode");
insertCodeInput.id = "codeInput";
insertCodeInput.setAttribute("pattern", "[0-9]+");
insertCodeInput.setAttribute("title", "Puoi inserire solamente numeri.");
insertCodeInput.setAttribute("maxlength", "4");
insertCodeLabel.classList.add("text");
insertCodeLabel.id = "roomJoinLabel";
insertCodeLabel.setAttribute("for", "codeInput");
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
        }, 500);
    }
};

// funzione per aggiungere gli elementi all'elemento parent con una transizione di trasparenza (stesso meccanismo della precedente)
const addElements = function (elems, parent) {
    for (const elem of elems) {
        // li aggiungo effettivamente ma con opacità a zero
        elem.style.transition = "opacity 0.5s";
        elem.style.opacity = 0;
        parent.appendChild(elem);
        // transizione a comparsa
        setTimeout( () => {
            elem.style.opacity = 1;
        }, 500);
    }
};

joinGameButton.addEventListener("click", () => {
     removeElements ([basicButton, usernameForm]);
     setTimeout(() => {
         addElements([insertCodeForm], rect);
    }, 500);
});

goBackButton1.addEventListener("click", () => {
    removeElements ([roomCode, loader, goBackButton1]);
    setTimeout(() => {
        addElements([usernameForm, basicButton], rect);
    }, 500);
});

goBackButton2.addEventListener("click", () => {
    removeElements ([insertCodeForm]);
    setTimeout(() => {
        addElements([usernameForm, basicButton], rect);
    }, 500);
});


// DA QUI IN POI CONNESSIONE BACK-END
// inizializziamo socket
const socket = io.connect('http://localhost:3000');

// il pulsante 'crea la nuova stanza' manda al server il comando 'createRoom'
startGameButton.addEventListener("click", () => {
    socket.emit('createRoom');
});

// attesa del segnale 'newGame' in arrivo dal server
socket.on('newGame', (data) => {
    const roomId = data;
    removeElements ([basicButton, usernameForm]);
    roomCodeNumber.textContent = roomId;
    setTimeout(function() {
        addElements([roomCode, loader, goBackButton1], rect);
    }, 500);
});

// il pulsante 'unisciti alla stanza' manda al server il comando 'joinRoom'
insertCodeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const roomId = insertCodeInput.value;
    socket.emit('joinRoom', roomId);
});





// prende l'username dal form ?? gestire lato server?? INSERIRE CONTROLLI LATO SERVER
usernameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    username = usernameFormInput.value;

    const usernameToast = document.getElementById('usernameToast');
    const bootstrapUsernameToast = new bootstrap.Toast(usernameToast, {
        delay: 1000
    });
    bootstrapUsernameToast.show();

});




