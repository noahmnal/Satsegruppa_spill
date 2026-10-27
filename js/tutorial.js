
function klikk(boks) {

    let apen = boks.dataset.apen !== "true";

    boks.dataset.apen = apen;

    if (apen === true) {

        if (boks.id === 'hvordan_spille') {

            boks.innerHTML = `Målet med spillet er å få så mange poeng som mulig ved å fange gjenstander som faller ned på boka. Du beveger karakteren frem og tilbake nederst på skjermen for å fange dem før de treffer bakken. Det gjelder å følge med på hva som faller ned, og bevege seg raskt nok til å rekke bort til riktig sted. Det er ikke alle gjenstandene som er bra å fange. Pils gir deg 20 poeng, fireball gir 50 poeng, og Hiroshima gir hele 100 poeng. Disse bør du prøve å fange for å få en høy poengsum. Trakten gjør at karakteren beveger seg raskere, noe som gjør det lettere å rekke bort til gjenstandene som faller ned. Du må derimot passe deg for Tenk-boka. Hvis du fanger den, dør du, og spillet er over. Derfor må du hele tiden vurdere hvilke gjenstander du skal gå etter, og hvilke du bør unngå. Øverst på skjermen ser du hvor mange poeng du har fått, og hvilken rekord du må prøve å slå. Jo flere poeng du samler, desto bedre. Målet er rett og slett å fange flest mulig av de riktige gjenstandene, unngå Tenk-bøkene og sette en ny rekord.`;

        }

        if (boks.id === 'keybinds') {

            boks.innerHTML = `Du kan styre karakteren med enten WASD-tastene eller piltastene på tastaturet. Begge fungerer på samme måte, så du kan bruke det du synes er enklest.

A eller ←: Beveg deg til venstre.

D eller →: Beveg deg til høyre.

W eller ↑: Beveg deg oppover.

S eller ↓: Beveg deg nedover.

Spillet foregår i 2D, så du kan bevege deg både sidelengs og opp og ned. Bruk tastene til å komme deg bort til gjenstandene som faller ned, samtidig som du prøver å unngå Tenk-bøkene. Det kan være lurt å holde inne en tast for å bevege seg kontinuerlig i en retning.`;

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
