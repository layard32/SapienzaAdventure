import express from "express"; // frame work 
import path from "path"; // per la gestione delle path
import bodyParser from "body-parser"; // per il parsing delle chiamate http
import { Server } from 'socket.io'; // per la comunicazione bidirezionale
import { createServer } from 'node:http'; // per le chiamate HTTP
import cookieParser from 'cookie-parser'; // per la gestione dei cookie 
import cookie from 'cookie';
let playerQueue = [];
let isPairing = false;
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const dir = path.resolve(); // percorso assoluto corrente
const PORT = 3000;

// avvio un server con express
const app = express();
app.use(cookieParser());
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

app.get("/tris", (req, res) => {
  res.sendFile(srcPath("tris.html"));
});

app.get("/hangman", (req, res) => {
  res.sendFile(srcPath("hangman.html"));
});

app.get("/pingpong", (req, res) => {
  res.sendFile(srcPath("pingpong.html"));
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

  /* funzione per joinare la stanza: l'utilizzo combinato di lock e flag consente ad uno solo client di
  porsi in attesa, ricorsivamente, che anche l'altro client sia pronto ad unirsi */
  socket.on('joinExistingRoom', (data) => {
    playerQueue.push({ socket: socket, room: data });
    lock.acquire("pairing", function() {
      if (!isPairing) {
        isPairing = true;
        pairPlayers();
      }
    });
  });

  // per lo spostamento del player secondario
  socket.on('requestMoveSecondaryPlayer', (data) => {
    socket.to(data.roomId).emit('moveSecondaryPlayer', { number: data.dice, special: data.special } );
  });

  socket.on('requestChangeTurn', (data) => {
    socket.to(data).emit('changeTurn');
  });

  socket.on('requestLooser', (data) => {
    socket.to(data).emit('looser');
  });

  //disconnessione forzata caso di refresh o chiusura 
  socket.on('requestForcedDisconnect',(data)=>{
    //trovo gli id dei clients
    const room = io.sockets.adapter.rooms.get(data);
    const clientIDs = room ? Array.from(room).map(socketId => io.sockets.sockets.get(socketId).id) : [];
    //identifico il player che si sta disconnettendo 
    const disconnectedPlayerID = clientIDs.find(id => id !== data);
    //notifico l'altro player(quello in partita)
    socket.to(disconnectedPlayerID).emit('forcedDisconnect');
    //console.log("aooooo ti sei arreso looser");

  })

  socket.on('gameEnd', (data) => {
    sendGameResult(data, socket.id);
  });

  socket.on('requestOtherUsername', (data) => {
    // prende l'id dell'altro client connesso alla stanza (non quello che ha mandato il segnale)
    const room = io.sockets.adapter.rooms.get(data);
    const otherSocketId = room ? Array.from(room).find(id => id !== socket.id) : undefined;
    const otherSocket = io.sockets.sockets.get(otherSocketId);
    if (!otherSocket) return;

    // processa i cookie relativo all'username
    let otherUsername = '';
    if (typeof otherSocket.handshake.headers.cookie === 'string') {
      const cookies = cookie.parse(otherSocket.handshake.headers.cookie);
      otherUsername = decodeURIComponent(cookies.username);
      // manda il segnale con l'altro username
      socket.emit('otherUsername', otherUsername);
    } 
  });

  socket.on('redirectToGame', ({ game, roomId })=> {
    // Invia un segnale a entrambi i giocatori nella stanza per reindirizzare al gioco specificato
    io.to(roomId).emit('redirectToBothGame', {game,roomId});
  });

  socket.on('quitGame',(data)=>{
    const nextPage = `/goose?room=${data.roomId}&pos1=${data.primaryPlayerPosition}&pos2=${data.secondaryPlayerPosition}&win=${data.win}&turn=${data.turn}`;
    socket.emit('redirect', nextPage );
  });
  
  socket.on('requestSetBonus', (data) => {
    socket.to(data).emit('setBonus');
  });

  //chat 
  socket.on("newuser",function(username){
    socket.broadcast.emit("update",username+"joined the conversation");
  });

  socket.on("chat",function(message){
    socket.broadcast.emit("chat",message);
  })
}); 

function sendGameResult(roomId, winnerId) {
    const clientIDs = Array.from(io.sockets.adapter.rooms.get(roomId)).map(socketId => io.sockets.sockets.get(socketId).id);
    const loserId = clientIDs.find(id => id !== winnerId);

    // Invia un messaggio di vittoria al vincitore
    io.to(winnerId).emit('gameWon');
    // Invia un messaggio di sconfitta al perdente
    io.to(loserId).emit('gameLost');
}

// funzione per far entrare i due player contemporaneamente alla stanza
function pairPlayers() {
  if (playerQueue.length >= 2) {
    const player1 = playerQueue.shift();
    const player2 = playerQueue.shift();

    player1.socket.join(player1.room);
    player2.socket.join(player2.room);

    // assegnazione dei turni
    setTimeout(() => {
      const room = io.sockets.adapter.rooms.get(player1.room);
      const clientIDs = room ? Array.from(room).map(socketId => io.sockets.sockets.get(socketId).id) : [];
      io.to(clientIDs[0]).emit('yourTurn', true);
      io.to(clientIDs[1]).emit('yourTurn', false);
    }, 500);

    isPairing = false;
    // rimuove i due player dalla queue
    playerQueue = playerQueue.slice(2);
  }
  // se ci sta solo un player, aspetta che entri il secondo richiamando la funzione
  else if (playerQueue.length < 2) {
    setTimeout(pairPlayers, 100); 
  }
}