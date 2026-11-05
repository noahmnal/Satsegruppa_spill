//Start-knapp
document.getElementById("startBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("startBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/gamePage.html";
    }, 200);
});

//Om oss-knapp
document.getElementById("omossBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("omossBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/aboutUs.html";
    }, 200);
});

//Tutorial-knapp
document.getElementById("tutorialBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("tutorialBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/tutorial.html";
    }, 200);
});

//Highscore knapp
document.getElementById("hsBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("hsBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/HighScore.html";
    }, 200);
});


//Karakterer knapp
document.getElementById("chBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("chBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/characters.html";
    }, 200);
});