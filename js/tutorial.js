
function klikk(boks) {
    let apen = boks.dataset.apen !== "true";
    boks.dataset.apen = apen;
    if (apen === true) {
        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `Målet er å få flest mulig enheter/poeng uten å treffe Tenk-boka, 
            eller bli for full . </br> Pils = 20 poeng </br> Fireball = 50 poeng </br> Hiroshima = 100 poeng </br>
            </br> MEN - hver gjenstand du tar minker også health bar-en, så du kan ikke samle for mange for fort. </br>
            Blir du for full og health bar-en går til 0, eller treffer du Tenk-boka, er spillet over. 
            </br> Trakten gjør karakteren raskere og vanskeligere å kontrollere, men gjør også at du regenerer liv raksere. </br>
             </br>Poengsummen vises øverst sammen med rekorden. </br>` ; 
        }
        if (boks.id === 'keybinds') {
            boks.innerHTML = `Du styrer karakteren med WASD-tastene eller piltastene. Begge funker på 
            samme måte, så det er bare å bruke det man synes er lettest. 
            </br> A eller ← er venstre. </br>D eller er høyre. </br>W eller ↑ er opp. </br>S eller ↓ er nedover. 
            </br>Spillet er 2D. Smart å holde inne en tast for å bevege seg kontinuerlig i en retning, men husk 
            at de blir mer sensitive med trakta.`;
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