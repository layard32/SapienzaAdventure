// importiamo le seguenti librerie
import express from "express"; // per semplificare la creazione di un webserver
import path, { dirname } from "path"; // per gestire le path 
import bodyParser from "body-parser"; // per analizzare le richieste in HTTP




// inizializziamo il server express sulla porta 3000
const app = express();
const port = 3000;

// usiamo una funzione della libreria path per calcolare il percorso completo di un file 
// nella cartella client/src/pages
const publicPath = (file) => path.join(__dirname, "public", file);

alert(publicPath("index.html"));