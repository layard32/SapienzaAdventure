import express from "express"; // frame work 
import path from "path"; // per la gestione delle path
import bodyParser from "body-parser"; // per il parsing delle chiamate http
import { Server } from 'socket.io'; // per la comunicazione bidirezionale
import { createServer } from 'node:http'; // per le chiamate HTTP

// importiamo le seguenti librerie

const dir = path.resolve(); // percorso assoluto corrente
const PORT = 3000;

// avvio un server con express
const app = express();
// preparo il server HTTP 
const server = createServer(app);
// preparo server con il socket per la comunicazione bidirezionale
// specificando che accetto connessioni da OVUNQUE
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// questa funzione prende in input un file e restituisce il percorso completo di un file all'interno di ../client/pages 
// dove si trovano i file html
const srcPath = (file) => path.join(dir, "./client/pages", file);

// settiamo il middleware del app affinché possa analizzare i dati sia in HTTP che JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// settiamo il middleware per servire i file statici nella cartella client
// per immagini, fogli di stile e script
app.use(express.static(path.join(dir, "./client")));

// definiamo le chiamate get per le routes
app.get("/", (req, res) => {
  res.sendFile(srcPath("index.html"));
});

app.get("/goose", (req, res) => {
  res.sendFile(srcPath("goose.html"));
});

app.get("/memory", (req, res) => {
  res.sendFile(srcPath("memory.html"));
});

app.get("/cfs", (req, res) => {
  res.sendFile(srcPath("cfs.html"));
});

// avvio il app express
server.listen(PORT, () => {
  console.log(`Il app è in esecuzione sulla porta: ${PORT}`);
});


// GESTIONE SOCKET
// dizionario che rappresenta le stanze. ha chiave codice della stanza e valore vuoto
const rooms = {};

// funzione per generare il numero randomico della stanza
function generateRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return randomNumber.toString();
}

// io.on è quando un client si connette al server
io.on('connection', (socket) => {

  // quando gli arriva il segnale 'createRoom'
  socket.on('createRoom', () => {
    // genero un numero randomico di tre cifre
    const roomId = generateRandomNumber();
    // assegniamo tale numero randomico come chiave di una stanza
    rooms[roomId] = {};
    // entro nella stanza
    socket.join(roomId);
    // passo il codice creato al client
    socket.emit('newGame', roomId);
    });

  // quando gli arriva il segnale 'joinRoom'
  socket.on('joinRoom', (data) => {
    // se la stanza è piena manda il segnale 'fullRoom' al client
    if (rooms[data] == null) console.log("room inesistente");
    else if (io.sockets.adapter.rooms.get(data).size > 1) socket.emit('fullRoom');
    else {
      socket.join(data);
      // invia l'evento a tutti i client nella stanza tranne a quello che ha premuto join
      socket.to(data).emit("playersConnected", data);
      // invia l'evento a chi ha premuto
      socket.emit("playersConnected", data);
    }
  });

  socket.on('joinExistingRoom', (data) => {
    socket.join(data);
    // assegna i turni
    setTimeout(() => {
        // prendi gli id dei clients nella stanza
        const clientIDs = Array.from(io.sockets.adapter.rooms.get(data)).map(socketId => io.sockets.sockets.get(socketId).id);
        io.to(clientIDs[0]).emit('yourTurn', true);
        io.to(clientIDs[1]).emit('yourTurn', false);
    }, 500);
  });

  // per lo spostamento del player secondario
  socket.on('requestMoveSecondaryPlayer', (data) => {
    socket.to(data.roomId).emit('moveSecondaryPlayer', data.dice);
  });

  socket.on('requestChangeTurn', (data) => {
    socket.to(data).emit('changeTurn');
  });

  /*socket.on('requestForcedDisconnect', (data) => {
    socket.to(data).emit('forcedDisconnect');
  }); */

  socket.on('requestLooser', (data) => {
    socket.to(data).emit('looser');
  });

  //disconnessione forzata caso di refresh o chiusura 
  socket.on('requestForcedDisconnect',(data)=>{
    //trovo gli id dei clients 
    const clientIDs = Array.from(io.sockets.adapter.rooms.get(data)).map(socketId => io.sockets.sockets.get(socketId).id);
    //identifico il player che si sta disconnettendo 
    const disconnectedPlayerID = clientIDs.find(id => id !== data);
    //notifico l'altro player(quello in partita)
    socket.to(disconnectedPlayerID).emit('forcedDisconnect');
    //console.log("aooooo ti sei arreso looser");

  })

  
  socket.on('gameEnd', (data) => {
    sendGameResult(data, socket.id);
  });

});

function sendGameResult(roomId, winnerId) {
    const clientIDs = Array.from(io.sockets.adapter.rooms.get(roomId)).map(socketId => io.sockets.sockets.get(socketId).id);
    const loserId = clientIDs.find(id => id !== winnerId);

    // Invia un messaggio di vittoria al vincitore
    io.to(winnerId).emit('gameWon');

    // Invia un messaggio di sconfitta al perdente
    io.to(loserId).emit('gameLost');
}

// per l'export su vercel
export default app;
