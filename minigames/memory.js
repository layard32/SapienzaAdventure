let counter=0;
let firstSelection="";
let secondSelection="";


const cards=document.querySelectorAll(".cards .card");
cards.forEach((card)=> {
    card.addEventListener("click", ()=>{
        card.classList.add("clicked"); /*viene aggiunta la classe clicked alle carte quando vengono cliccate*/

        /*se il counter è a 0 allora si seleziona la prima carta e si memorizza l'attributo subject*/
        if(counter === 0){
            carta1=card
            firstSelection=carta1.getAttribute("subject");
            counter++;
        }
        else{
            carta2=card
            secondSelection=carta2.getAttribute("subject");
            counter=0;

            if(secondSelection===firstSelection && carta1!==carta2){
                const correctCards=document.querySelectorAll(".card[subject='" + firstSelection+ "']");

                correctCards[0].classList.add("checked");
                correctCards[0].classList.remove("clicked");
                correctCards[1].classList.add("checked");
                correctCards[1].classList.remove("clicked");
            }
            else{
                const incorrectCards=document.querySelectorAll(".card.clicked");

                incorrectCards[0].classList.add("shake");
                incorrectCards[1].classList.add("shake");

                setTimeout(()=>{
                    incorrectCards[0].classList.remove("shake");
                    incorrectCards[0].classList.remove("clicked");
                    incorrectCards[1].classList.remove("shake");
                    incorrectCards[1].classList.remove("clicked");
                }, 800);
            }

        }
        


    });
});