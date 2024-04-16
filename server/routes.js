// importiamo le seguenti librerie
import express from "express"; // frame work 
import path from "path"; // per la gestione delle path
import bodyParser from "body-parser"; // per il parsing delle chiamate http

const dir = path.resolve(); // percorso assoluto corrente

// avvio un server con express
const server = express(); 
const PORT = 3000;

// questa funzione prende in input un file e restituisce il percorso completo di un file all'interno di ../client/pages 
// dove si trovano i file html
const srcPath = (file) => path.join(dir, "../client/pages", file);

// settiamo il middleware del server affinché possa analizzare i dati sia in HTTP che JSON
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// settiamo il middleware per servire i file statici nella cartella client
// per immagini, fogli di stile e script
server.use(express.static(path.join(dir, "../client")));

// definiamo le chiamate get per le routes
server.get("/", (req, res) => {
  res.sendFile(srcPath("index.html"));
});

server.get("/goose", (req, res) => {
  res.sendFile(srcPath("goose.html"));
});

server.get("/memory", (req, res) => {
  res.sendFile(srcPath("memory.html"));
});

server.get("/cfs", (req, res) => {
  res.sendFile(srcPath("cfs.html"));
});

// avvio il server express
server.listen(PORT, () => {
  console.log(`Il server è in esecuzione sulla porta: ${PORT}`);
});