//Initial References
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const canvas = document.getElementById("canvas");
let container = document.querySelector("#special");

let win=false;
let interval; 

//appena la pagina viene caricata inizia il game
window.onload = function() {
  initializer();
  startGameTimer(); //inizia anche il timer
};

//creo il dizionario delle parole suddiviso per categoria
let options = {
  frutta: [
    "Mela",
    "Mirtillo",
    "Mandarino",
    "Ananas",
    "Melograno",
    "Anguria",
  ],
  animali: ["Riccio", "Rinoceronte", "Scoiattolo", "Pantera", "Tricheco", "Zebra"],
  paesi: [
    "Italia",
    "Ungheria",
    "Germania",
    "Svizzera",
    "Zimbabwe",
    "Norvegia",
  ],
};

//variabili per tenere il conto
let winCount = 0;
let count = 0;

let chosenWord = "";

//mostra le opzioni da scegliere
const displayOptions = () => {
  let bigText = document.createElement("div");
  bigText.id = "big-text";
  bigText.textContent = "Selezionate un'opzione"
  optionsContainer.appendChild(bigText);

  let smallText = document.createElement("div");
  smallText.id = "small-text";
  smallText.textContent = "Vinci per ottenere punti bonus per la corsa verso la Laurea!"
  optionsContainer.appendChild(smallText);

  let buttonCon = document.createElement("div");
  buttonCon.classList.add("button-container");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

//serve a bloccare i tasti
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");

  //disabilito le categorie
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  //disabilito la tastiera
  letterButtons.forEach((button) => {
    button.disabled.true;
  });

  // mostrato modale di fine partita
  container.innerHTML = '';
  showWin();
};

function showWin() {
  container.style.minHeight = "400px";
  let wordContainer = document.createElement("div");
  let winMessage = document.createElement("div");
  let word = document.createElement("div");

  winMessage.id = "winMessage";
  word.id = "word";
  wordContainer.id = "wordContainer";

  if (win) { winMessage.innerHTML = `Hai <span style="color: green">vinto</span>!!`; } 
  else if (!win) { winMessage.innerHTML = `Hai <span style="color: red">perso</span>!!`; }
  word.textContent = "La parola era " + chosenWord + ".";

  wordContainer.appendChild(winMessage);
  wordContainer.appendChild(word);
  container.appendChild(wordContainer);
}

//una volta scelta la categoria, questa funzione scegli in maniera casuale una parola 
const generateWord = (optionValue) => {
  container.style.minHeight = "560px";

  let optionsButtons = document.querySelectorAll(".options");

  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue];
  //scelgo in maniera casuale
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  //sostituisco le lettere della parola scelta con _ 
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  userInputSection.innerHTML = displayItem;
};

//funzione di inizio gioco c
const initializer = () => {
  winCount = 0;
  count = 0;

  //all'inizio è tutto vuoto e nascondo i tasti della tastiera 
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  //creo i pulsanti della tastiera(cioè le lettere da A-Z)
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");

    button.classList.add("letters");

    button.innerText = String.fromCharCode(i);

    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      //se la parola scelta in maniera casuale contiene la lettera cliccata allora sostituisci _ con la lettera altrimenti disegno l'hangman
      if (charArray.includes(button.innerText)) {

        charArray.forEach((char, index) => {

          if (char === button.innerText) {
            dashes[index].innerText = char;
            //aumento il punteggio win
            winCount += 1;
            //se winCount è uguale alla lunghezza della parola scelta random, allora ho vinto
            if (winCount == charArray.length) {
              win=true;
              //blocco i pulsanti e mostro il modale del risultato
              blocker();
            }
          }
        });
      } else {
        //altrimenti aumento il lose count
        count += 1;
        //disegno hangman
        drawMan(count);
        //se count è uguale a 6 significa che il disegno dell'hangman è completo (ho perso)
        if (count == 6) {
          win=false;
          blocker();
        }
      }
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();
  //chiamata a canvasCreator (per cancellare il canvas precedente e creare la schermata iniziale )
  let { initialDrawing } = canvasCreator();

  initialDrawing();
};

const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //per disegnare le linee
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  //schermata iniziale
  const initialDrawing = () => {
    //pulisco il canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //linea in basso
    drawLine(10, 130, 130, 130);
    //linea sinistra (quella in verticale)
    drawLine(10, 10, 10, 131);
    //linea in alto 
    drawLine(10, 10, 70, 10);
    //linea piccola in alto (da dove parte impiccato)
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//disegno l'hangman
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

//funzione per il timer
function startTimer(duration) {
  var timer = duration, minutes, seconds;
  interval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (--timer < 0) {
        clearInterval(interval);
        endGame(); // Controlla la fine della partita quando il timer arriva a zero
      }
  }, 1000);
}

function startGameTimer() {
  var Minutes = 30;
  startTimer(Minutes);
  updateTimerBar(Minutes);
}

function updateTimerBar(duration) {
  var timerBar = document.querySelector('#timerBar');
  timerBar.style.animationDuration = duration + 's';
}

//funzione di fine gioco che notifica il server che è finito il gioco
function endGame() {
  setTimeout(()=>{
    socket.emit('quitGame', { roomId: roomId, 
      primaryPlayerPosition: primaryPosition,
      secondaryPlayerPosition: secondaryPosition,
      win: win, 
      turn: turn });
    }, 1000);

}

//GESTIONE SERVER
const urlParams = new URLSearchParams(window.location.search);
// prendo i parametri passati tramite chiamata GET
const roomId = urlParams.get('room');
const primaryPosition = urlParams.get('pos1');
const secondaryPosition = urlParams.get('pos2')
const turn = urlParams.get('turn');
const socket = io.connect('http://localhost:3000');

socket.emit("joinExistingRoom",roomId);

socket.on('redirect', (data) => {
  // effettuo il reindirizzamento al goose
  window.location.href = data;
});
