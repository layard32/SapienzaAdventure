//Initial References
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

let win=true;
let interval; 

//New Game
window.onload = function() {

  initializer();
  startGameTimer();
};



//Options values for buttons
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

//count
let winCount = 0;
let count = 0;

let chosenWord = "";

//Display option buttons
const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Selezionate un'opzione</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

//Block all the Buttons
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  //disable all options
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  //disable all letters
  letterButtons.forEach((button) => {
    button.disabled.true;
  });
  newGameContainer.classList.remove("hide");
};

//Word Generator
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");
  //If optionValur matches the button innerText then highlight the button
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  //initially hide letters, clear previous word
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue];
  //choose random word
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  //replace every letter with span containing dash
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  //Display each element as span
  userInputSection.innerHTML = displayItem;
};

//Initial Function (Called when page loads/user presses new game)
const initializer = () => {
  winCount = 0;
  count = 0;

  //Initially erase all content and hide letteres and new game button
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  //For creating letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    //Number to ASCII[A-Z]
    button.innerText = String.fromCharCode(i);
    //character button click
    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      //if array contains clciked value replace the matched dash with letter else dram on canvas
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //if character in array is same as clicked button
          if (char === button.innerText) {
            //replace dash with letter
            dashes[index].innerText = char;
            //increment counter
            winCount += 1;
            //if winCount equals word lenfth
            if (winCount == charArray.length) {
              win=true;
              resultText.innerHTML = `<h2 class='win-msg'>Hai Vinto!!</h2><p>La parola era <span>${chosenWord}</span></p>`;
              //block all buttons
              blocker();
            }
          }
        });
      } else {
        //lose count
        count += 1;
        //for drawing man
        drawMan(count);
        //Count==6 because head,body,left arm, right arm,left leg,right leg
        if (count == 6) {
          win=false;
          resultText.innerHTML = `<h2 class='lose-msg'>Hai Perso!!</h2><p>La parola era <span>${chosenWord}</span></p>`;
          blocker();
        }
      }
      //disable clicked button
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();
  //Call to canvasCreator (for clearing previous canvas and creating initial canvas)
  let { initialDrawing } = canvasCreator();
  //initialDrawing would draw the frame
  initialDrawing();
};

//Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //For drawing lines
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

  //initial frame
  const initialDrawing = () => {
    //clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//draw the man
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


// Funzione per avviare il timer con una durata di 3 minuti (180 secondi)
function startGameTimer() {
  var Minutes = 30;
  startTimer(Minutes);
  updateTimerBar(Minutes);
}
// Funzione per aggiornare la barra del timer
function updateTimerBar(duration) {
  var timerBar = document.querySelector('#timerBar');
  timerBar.style.animationDuration = duration + 's'; // Imposta la durata dell'animazione
}

function endGame() {
  if (count < 6) {
    resultText.innerHTML = `<h2 class='lose-msg'>Hai Perso!!</h2><p>La parola era <span>${chosenWord}</span></p>`;
    blocker();
    win = false;
    // Invia i dati al server
    setTimeout(() => {
      socket.emit('quitGame', { roomId: roomId, 
        primaryPlayerPosition: primaryPosition, 
        secondaryPlayerPosition: secondaryPosition, 
        win: win, 
        turn: turn });
    }, 1000);
  }else{
    setTimeout(() => {
      socket.emit('quitGame', { roomId: roomId, 
        primaryPlayerPosition: primaryPosition, 
        secondaryPlayerPosition: secondaryPosition,
        win: win, 
        turn: turn });
    }, 1000);

  }
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
  // Effettua il reindirizzamento alla nuova pagina
  window.location.href = data;
});
