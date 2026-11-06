
function klikk(boks) {
    let apen = boks.dataset.apen !== "true";
    boks.dataset.apen = apen;
    if (apen === true) {
        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `Målet med spillet er å få så mange poeng som mulig ved å fange gjenstander som faller ned på boka. Man beveger karakteren frem og tilbake nederst på skjermen for å fange dem før de treffer bakken. Man prøver å å følge med på tingene som faller ned og bevege seg så raskt nok til å rekke bort til riktig sted. Pils gir deg 20 poeng, fireball 50 poeng, og Hiroshima gir 100. Trakten gjør at karakteren beveger seg raskere. Da blir det lettere å rekke bort til gjenstandene som faller ned. Men Hvis man er nær Tenk-boka dør man og spillet er over, så den må man dodge. Øverst på skjermen går poengene opp mens du spiller, ved siden av står det hvilken rekord du må prøve å slå. Målet er rett og slett å fange flest mulig av de riktige tingene, unngå Tenk-bøkene og sette en ny rekord som kommer på leaderboard.`;
        }
        if (boks.id === 'keybinds') {
            boks.innerHTML = `Du styrer firkanten med WASD-tastene eller piltastene. Begge funker på samme måte, så det er bare å bruke det man synes er lettest. </br> A eller ← er venstre. </br>D eller er høyre. </br>W eller ↑ er opp. </br>S eller ↓ er nedover. </br>Spillet er 2D. Smart å holde inne en tast for å bevege seg kontinuerlig i en retning, men husk at de blir mer sensitive med trakta.`;
        }
        boks.classList.remove('lukket_div');
        boks.classList.add('apnet_div');
    } else {
        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `<div class="rounded p-5 text-center">Hvordan spille</div>`;
        }
        if (boks.id === 'keybinds') {
            boks.innerHTML = `<div class="rounded p-5 text-center">Keybinds</div>`;
        }
        boks.classList.remove('apnet_div');
        boks.classList.add('lukket_div');
    }
}
document.querySelectorAll('.col-md-4').forEach((boks) => {
    boks.addEventListener('click', () => klikk(boks));
});



document.getElementById("tilbakeBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("tilbakeBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/mainPage.html";
    }, 200);
});