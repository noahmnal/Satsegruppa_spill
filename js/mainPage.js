// ================= FORHÅNDSLASTING AV LYDER (helt øverst) =================
const hoverLyd = new Audio("../resources/sounds/hoverclick.wav");
const klikkLyd = new Audio("../resources/sounds/clickmain.wav");
hoverLyd.preload = "auto";
klikkLyd.preload = "auto";

// Spiller lyden fra start hver gang
function spill(lyd) {
    lyd.currentTime = 0;
    lyd.play().catch(() => {});
}

// ================= START-KNAPP =================
document.getElementById("startBtn").addEventListener("mouseenter", () => {
    spill(hoverLyd); // hover-lyd
});
document.getElementById("startBtn").addEventListener("click", () => {
    spill(klikkLyd); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/gamePage.html";
    }, 200);
});

// ================= OM OSS-KNAPP =================
document.getElementById("omossBtn").addEventListener("mouseenter", () => {
    spill(hoverLyd); // hover-lyd
});
document.getElementById("omossBtn").addEventListener("click", () => {
    spill(klikkLyd); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/aboutUs.html";
    }, 200);
});

// ================= TUTORIAL-KNAPP =================
document.getElementById("tutorialBtn").addEventListener("mouseenter", () => {
    spill(hoverLyd); // hover-lyd
});
document.getElementById("tutorialBtn").addEventListener("click", () => {
    spill(klikkLyd); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/tutorial.html";
    }, 200);
});

// ================= NIVÅ-KNAPP =================
document.getElementById("nivåBtn").addEventListener("mouseenter", () => {
    spill(hoverLyd); // hover-lyd
});
document.getElementById("nivåBtn").addEventListener("click", () => {
    spill(klikkLyd); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/Nivå.html";
    }, 200);
});

// ================= HIGHSCORE-KNAPP =================
document.getElementById("hsBtn").addEventListener("mouseenter", () => {
    spill(hoverLyd); // hover-lyd
});
document.getElementById("hsBtn").addEventListener("click", () => {
    spill(klikkLyd); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/HighScore.html";
    }, 200);
});


let nivåer = ["Lett", "Medium", "Vanskelig", "Fadderuka"];
let nivå = Number(localStorage.getItem("nivå"));
let nivåKnapp = document.getElementById("nivåBtn");
let tilbakeTimer;

nivåKnapp.addEventListener("click", () => {
    if (nivåKnapp.textContent !== "Nivå") {
        nivå = (nivå + 1) % nivåer.length;
        localStorage.setItem("nivå", nivå);
    }
    nivåKnapp.textContent = nivåer[nivå];
    nivåKnapp.className = "gameBtn " + nivåer[nivå].toLowerCase();

    clearTimeout(tilbakeTimer);
    tilbakeTimer = setTimeout(() => {
        nivåKnapp.textContent = "Nivå";
        nivåKnapp.className = "gameBtn";
    }, 2000);
});