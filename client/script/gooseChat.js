/* gestione lato-client della chatbox
la porzione di codice dedicata alla comunicazione tramite socket è stata lasciata nel file principale */

// Event listener per il click sul pulsante per aprire o chiudere la chat
document.getElementById("open-chat").addEventListener("click", function(){
    const chatScreen = document.querySelector(".chat-screen");
    if (chatScreen.classList.contains("active")) {
        // Se la chat è già attiva, la chiudiamo
        chatScreen.classList.remove("active");
    } else {
        // Altrimenti, attiviamo la chat
        chatScreen.classList.add("active");
    }
});

// Event listener per la pressione del tasto "Invio" nel campo di input del messaggio
document.querySelector(".chat-screen #message-input").addEventListener("keydown", function(event) {
    // Verifica se il tasto premuto è il tasto "Invio" (codice 13)
    if (event.keyCode === 13) {
        // Impedisce il comportamento predefinito del tasto "Invio" (evita di inviare una nuova riga)
        event.preventDefault();
        // Simula il click del pulsante "Invia"
        document.getElementById("send-message").click();
    }
});

// Funzione per renderizzare i messaggi nella finestra di chat
function renderMessage(type, message, username, secondaryUsername){
    let messageContainer = document.querySelector(".chat-screen .messages"); // Contenitore dei messaggi
    if(type == "my"){
        let messageDiv = document.createElement("div"); // Crea un elemento div per il messaggio inviato dall'utente
        messageDiv.classList.add("message", "my-message"); // Aggiungi classi per lo stile CSS
        messageDiv.innerHTML = `
            <div>
                <div class="name">${username}</div> 
                <div class="text-chat">${message.text}</div>
            </div>
        `;
        messageContainer.appendChild(messageDiv); // Aggiungi il messaggio al contenitore dei messaggi
    } else if(type == "other"){
        let messageDiv = document.createElement("div"); // Crea un elemento div per il messaggio ricevuto dall'altro utente
        messageDiv.classList.add("message", "other-message"); 
        messageDiv.innerHTML = `
            <div>
                <div class="name">${secondaryUsername}</div> <!-- Utilizza il nome utente del mittente del messaggio -->
                <div class="text-chat">${message.text}</div>
            </div>
        `;
        messageContainer.appendChild(messageDiv); // Aggiungi il messaggio al contenitore dei messaggi
    } else if(type == "update"){
        let updateDiv = document.createElement("div"); // Crea un elemento div per l'aggiornamento della chat
        updateDiv.classList.add("update"); 
        updateDiv.innerText = message; 
        messageContainer.appendChild(updateDiv); // Aggiungi l'aggiornamento al contenitore dei messaggi
    }
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight; // Scrolling automatico verso il basso per mostrare i messaggi più recenti
}

export { renderMessage };