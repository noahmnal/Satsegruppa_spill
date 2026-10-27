// Start-knapp
document.getElementById("startBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("startBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
       window.location.href = "../html/gamePage.html";
    }, 200);
});

// Om oss-knapp
document.getElementById("omossBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("omossBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
    window.location.href = "../html/aboutUs.html";
    }, 200);
});

// Tutorial-knapp
document.getElementById("tutorialBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("tutorialBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
    window.location.href = "../html/tutorial.html";
    }, 200);
});

// Nivå-knapp 
document.getElementById("nivåBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("nivåBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
});

// Highscore-knapp 
document.getElementById("hsBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("hsBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
    window.location.href = "../html/HighScore.html";
    }, 200);
});
let nivåer = ["easy", "medium", "hard", "Fadderuka"];
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