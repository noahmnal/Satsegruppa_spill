// dette definerer hvor mye liv man skal ha
let health = 100;
let liv = document.getElementById("liv");

//Game over funksjon + skjerm
let død = false;

function gameOver(){
    død = true;
}

// Definerer hvor mye som reduseres hver gang (handling) skjer
// i dette tilfellet er det hver gang du trykker på "- Liv"
document.getElementById("minusKnapp").onclick = function () {
    health -= 10;
    liv.style.width = health + "%";
    if (health <= 0) {
        gameOver();
    }
}
//dette legger til liv ved å trykke knappen
// dette kan vi endre til kontakt med forskjellige elementer i spillet

document.getElementById("livKnapp").onclick = function () {
    if (health < 100) {
        health += 10;
        liv.style.width = health + "%";
    }
}