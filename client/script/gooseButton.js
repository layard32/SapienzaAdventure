// gestione del pulsante 'lancia il dado'
document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("button");
    let hand = document.querySelector(".hand");
    let holdInterval;
    
    setTimeout(function() {
        hand.style.visibility = "visible";
        hand.style.opacity = "1";
        button.classList.add("progress");
    }, 1000);
     
    setTimeout(function() {
        button.classList.remove("progress");
        hand.style.opacity = "0";
        setTimeout(function(){
            hand.style.visibility = "hidden";
        }, 1100);
    }, 3400); 

    button.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    button.addEventListener("mousedown", function() {
        button.classList.add("progress"); 
        holdInterval = setInterval(function() {
            button.classList.remove("progress");
        }, 3200); 

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
        }, 3200); 
    });

    button.addEventListener("touchend", function() {
        clearInterval(holdInterval);
        button.classList.remove("progress"); 
    });
});