const bonusCells = [3, 9, 26, 30, 36, 38];

/* gestione flip cards, tramite tre funzioni: 
1. una per inizializzare nel dom, 
2. una per mostrarle
3. una per attivare la relativa azione; quest'ultima si trova nel file principale */

function initializeFlipcards() {
    const flipcard = document.createElement('div');
    flipcard.classList.add('flip-card', 'text');
    const flipCardInner = document.createElement('div');
    flipCardInner.classList.add('flip-card-inner');
    const flipcardfront = document.createElement('div');
    flipcardfront.classList.add('flip-card-front');
    const flipcardback = document.createElement('div');
    flipcardback.classList.add('flip-card-back');
    flipCardInner.appendChild(flipcardfront);
    flipCardInner.appendChild(flipcardback);
    flipcard.appendChild(flipCardInner);
    document.body.appendChild(flipcard);
    flipcard.style.visibility = 'hidden';
    
    return {flipcard, flipcardfront, flipcardback};
}

function showFlipCard(cell) {
    if (bonusCells.includes(cell)) {
        const {flipcard, flipcardfront, flipcardback } = initializeFlipcards();

        if (cell == 30 ) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity=1;
            flipcardfront.style.backgroundImage = `url('../images/minerva.png')`;
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'IMPREVISTO';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'IMPREVISTO';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Oh no, c'è stato un imprevisto!  Hai guardato la minerva negli occhi, vai indietro di 3 caselle.";
            flipcardback.appendChild(pBack);
            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => { 
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
        else if (cell == 9) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity=1;
            flipcardfront.style.backgroundImage = `url('../images/fisica.png')`;
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'IMPREVISTO';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'IMPREVISTO';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Oh no, c'è stato un imprevisto! Non hai passato l'esame di fisica, vai indietro di 2 caselle.";
            flipcardback.appendChild(pBack);
             
            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => {
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
        else if (cell == 38) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity=1;
            flipcardfront.style.backgroundImage = `url('../images/tesi.png')`;
              
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'IMPREVISTO';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'IMPREVISTO';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Oh no, c'è stato un imprevisto! Devi scrivere la tesi, vai indietro di 3 caselle.";
            flipcardback.appendChild(pBack);
            
            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => {
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
        else if (cell == 3) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity = 1;
            flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
              
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'BONUS';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'BONUS';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Bravo! Hai superato un esonero, vai avanti di 2 caselle.";
            flipcardback.appendChild(pBack);
            
            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => {
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
        else if (cell == 36) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity=1;
            flipcardfront.style.backgroundImage = `url('../images/esonero.png')`;
            
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'BONUS';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'BONUS';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Bravo! Hai superato l'ultimo esame, vai avanti di 1 casella.";
            flipcardback.appendChild(pBack);
            
            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => {
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
        else if (cell == 26) {
            flipcard.style.visibility = 'visible';
            flipcard.style.opacity=1;
            flipcardfront.style.backgroundImage = `url('../images/relatore.png')`;
                        
            const h1Front = document.createElement('h1');
            h1Front.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Front.textContent = 'BONUS';
            flipcardfront.appendChild(h1Front);

            const h1Back = document.createElement('h1');
            h1Back.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            h1Back.textContent = 'BONUS';
            flipcardback.appendChild(h1Back);

            const pBack = document.createElement('p');
            pBack.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
            pBack.textContent = "Bravo! Sei riuscito a trovare un relatore per la tesi, vai avanti di 2 caselle.";
            flipcardback.appendChild(pBack);

            setTimeout(() => {
                flipcard.style.opacity = '0';
            }, 3600);
            setTimeout(() => {
                flipcard.style.visibility = 'hidden';
                setTimeout(() => {
                    flipcard.remove();
                }, 5000);
            }, 4600);
        }
    }
}

export { showFlipCard };