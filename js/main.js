
// 1. Tilstand
let bane = 1;       // 0 = venstre, 1 = midten, 2 = høyre
let poeng = 0;
let fart = 5;       // piksler per steg
let objekter = [];  // alle ølbokser og hindringer på brettet
let loop = null;    // spill-løkken, null når spillet står stille
 
let brett = document.getElementById("brett");
let spiller = document.getElementById("spiller");
let poengTekst = document.getElementById("poeng");
let melding = document.getElementById("melding");
 
// Rekord: hentes fra nettleseren (blir 0 første gang)
let rekord = Number(localStorage.getItem("rekord"));
let rekordTekst = document.getElementById("rekord");
rekordTekst.textContent = "Rekord: " + rekord;
 
// 2. Styring
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && bane > 0) bane--;
  if (e.key === "ArrowRight" && bane < 2) bane++;
  spiller.style.left = bane * 100 + "px";
 
  if (e.key === " " && loop === null) start();
});
 
// 3. Spill-løkken: kjøres ca. 33 ganger i sekundet
function steg() {
  if (Math.random() < 0.05) lagObjekt();
  flyttObjekter();
  sjekkTreff();
  fjernPasserte();
}
 
// 4. Lage en ølboks eller et hinder øverst i en tilfeldig bane
function lagObjekt() {
  let element = document.createElement("div");
  let nyBane = Math.floor(Math.random() * 3);
  let type = "ol";
  if (Math.random() < 0.3) type = "hinder";
 
  element.className = type;
  if (type === "ol") {
    element.textContent = "🍺";
  } else {
    element.textContent = "🛢️";
  }
  element.style.left = nyBane * 100 + "px";
  element.style.top = "-50px";
  brett.appendChild(element);
 
  objekter.push({ element: element, bane: nyBane, top: -50, type: type });
}
 
// 5. Flytte alle objekter nedover
function flyttObjekter() {
  for (let i = 0; i < objekter.length; i++) {
    objekter[i].top = objekter[i].top + fart;
    objekter[i].element.style.top = objekter[i].top + "px";
  }
}
 
// 6. Kollisjon (baklengs, fordi vi kan fjerne fra lista underveis)
function sjekkTreff() {
  for (let i = objekter.length - 1; i >= 0; i--) {
    let obj = objekter[i];
    if (obj.bane === bane && obj.top > 400 && obj.top < 490) {
      if (obj.type === "hinder") {
        gameOver();
        return;
      }
      poeng++;
      poengTekst.textContent = "Poeng: " + poeng;
      if (poeng % 10 === 0) fart++;
      obj.element.remove();
      objekter.splice(i, 1);
    }
  }
}
 
// 7. Fjerne objekter som har passert bunnen
function fjernPasserte() {
  for (let i = objekter.length - 1; i >= 0; i--) {
    if (objekter[i].top > 500) {
      objekter[i].element.remove();
      objekter.splice(i, 1);
    }
  }
}
 
function gameOver() {
  clearInterval(loop);
  loop = null;
 
  if (poeng > rekord) {
    rekord = poeng;
    localStorage.setItem("rekord", rekord);
    rekordTekst.textContent = "Rekord: " + rekord;
  }
 
  melding.textContent = "Game over! Du fikk " + poeng + " poeng. Trykk mellomrom for å prøve igjen";
  melding.style.display = "block";
}
 
function start() {
  for (let i = 0; i < objekter.length; i++) {
    objekter[i].element.remove();
  }
  objekter = [];
  poeng = 0;
  fart = 5;
  bane = 1;
  spiller.style.left = "100px";
  poengTekst.textContent = "Poeng: 0";
  melding.style.display = "none";
  loop = setInterval(steg, 30);
}