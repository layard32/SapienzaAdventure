// gestione del pulsante 'lancia il dado'

document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("button");
    let holdInterval;

    button.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    button.addEventListener("mousedown", function() {
        button.classList.add("progress"); 
        holdInterval = setInterval(function() {
            button.classList.remove("progress");
        }, 3000); 
    });

    button.addEventListener("mouseup", function() {
        clearInterval(holdInterval);
        button.classList.remove("progress"); 
    });

    button.addEventListener("mouseleave", function() {
        clearInterval(holdInterval);
        button.classList.remove("progress"); 
    });

    button.addEventListener("touchstart", function() {
        button.classList.add("progress"); 
        holdInterval = setInterval(function() {
            button.classList.remove("progress");
        }, 3000); 
    });

    button.addEventListener("touchend", function() {
        clearInterval(holdInterval);
        button.classList.remove("progress"); 
    });
});