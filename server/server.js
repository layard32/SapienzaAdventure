import express from "express"; // frame work 
import path from "path"; // per la gestione delle path
import bodyParser from "body-parser"; // per il parsing delle chiamate http
import { Server } from 'socket.io'; // per la comunicazione bidirezionale
import { createServer } from 'node:http'; // per le chiamate HTTP
import cookieParser from 'cookie-parser'; // per la gestione dei cookie 
import cookie from 'cookie';
import AsyncLock from 'async-lock';
const lock = new AsyncLock();
let playerQueue = [];
let playerExitQueue = [];

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

  /* funzione per joinare la stanza, da goose in poi: l'utilizzo della lock asincrona e delle premesse consente, ad un solo client,
  di aspettare l'altro ed eseguire poi l'assegnazione dei turni */
  socket.on('joinExistingRoom', (data) => {
    // aggiungiamo il player interessato ad entrare dentro una queue
    playerQueue.push({ socket: socket, room: data });
    /* il lock fa si che solo un client possa accedere alla funzione pairPlayers (il primo client che manda l'evento joinExistingRoom)
    si utilizza come key la roomId: in questo modo diverse coppie di giocatori possono giocare contemporaneamente */
    if (lock.isBusy(data)) console.log('lock già preso da un altro client');
    else lock.acquire(data, () => pairPlayers(socket, data));
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

  socket.on('redirectToGame', ({ game, roomId }) => {
    /* utilizziamo un meccanismo simile al join, basato su lock e
    una queue in cui tenere i client che vogliono uscire ed essere reindirizzati ad un gioco */
    playerExitQueue.push({ socket: socket, room: roomId });
    if (lock.isBusy(game)) console.log('lock già preso da un altro client');
    else lock.acquire (game, () => { exitAndRedirect (game, roomId, socket); })
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

// funzione di wait tramite promise
function delay (time) {
  return new Promise(resolve => { 
    setTimeout(() => { resolve() }, time);
  })
}

// la funzione chiamata dal lock nell'evento joinExistingRoom
async function pairPlayers(socket, roomId) {
  /* finché non ci sta un altro player nella queue, DIVERSO DA QUELLO CHE HA CHIAMATO LA FUNZIONE nella queue 
  e che vuole entrare nella stessa stanza, si sfrutta l'await su una funzione async (pur non essendo async, 
  lo è nel senso che restituisce una promise) per aspettare */
  while (!playerQueue.some((player) => player.room == roomId && player.socket.id != socket.id)) await delay(100);

  // il client accede a questa porzione di codice solo quando un altro player segnala di voler entrare stessa nella stanza

  /* prendiamo i due client interessati ad entrare nella stessa stanza e li rimuoviamo dalla queue
  ciò evita problemi per eventuali altri client interessati ad entrare */ 
  const player1 = playerQueue.find(player => player.socket === socket);
  const player2 = playerQueue.find(player => player.room === player1.room && player.socket !== player1.socket);

  if (!player1 || !player2) {
    console.log('uno dei due player nella queue non è definito');
    return;
  }

  player1.socket.join(player1.room);
  player2.socket.join(player2.room);
  playerQueue = playerQueue.filter(player => player !== player1 && player !== player2);

  // assegnazione dei turni
  setTimeout(() => {
    const room = io.sockets.adapter.rooms.get(player1.room);
    const clientIDs = room ? Array.from(room).map(socketId => io.sockets.sockets.get(socketId).id) : [];
    io.to(clientIDs[0]).emit('yourTurn', true);
    io.to(clientIDs[1]).emit('yourTurn', false);
  }, 500);
}

async function exitAndRedirect (game, roomId, socket) {
  /* analogamente all'entrata, aspetto ci sia un altro player, con lo stesso roomId
  che vuole uscire ed essere reindirizzato ad un altro minigame */
  while (!playerExitQueue.some((player) => player.room == roomId && player.socket.id != socket.id)) await delay(1000);

  // si accede a questa porzione di codice solo quando c'è un altro client che vuole uscire per entrare allo stesso gioco

  // prendo i due client che volevano uscire
  const player1_exit = playerExitQueue.find(player => player.socket === socket);
  const player2_exit = playerExitQueue.find(player => player.room === player1_exit.room && player.socket !== player1_exit.socket);
  playerExitQueue = playerExitQueue.filter(player => player !== player1_exit && player !== player2_exit);

  if (!player1_exit || !player2_exit) {
    console.log('uno dei due player nella queue non è definito');
    return;
  }

  // faccio uscire i client dalla stanza e poi emitto ai loro socket 
  player1_exit.socket.leave(roomId);
  player2_exit.socket.leave(roomId);
  player1_exit.socket.emit('redirectToBothGame', {game, roomId});
  player2_exit.socket.emit('redirectToBothGame', {game, roomId});
}