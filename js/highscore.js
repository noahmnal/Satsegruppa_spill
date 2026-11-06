let highscores = JSON.parse(localStorage.getItem("highscores") || "[]");
const highscoreList = document.getElementById("highscore-list");

if (highscores.length === 0) {
    const oldRecord = Number(localStorage.getItem("rekord"));
    if (oldRecord > 0) {
        highscores.push(oldRecord);
    }
}

if (highscores.length === 0) {
    highscoreList.innerHTML = "<li>Ingen poeng registrert ennå</li>";
} else {
    for (let score of highscores) {
        const entry = document.createElement("li");
        if (typeof score === "number") {
            entry.textContent = score + " poeng";
        } else {
            entry.textContent = (score.name ? score.name + ": " : "") + score.score + " poeng";
        }
        highscoreList.appendChild(entry);
    }
}


document.getElementById("tilbakeBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("tilbakeBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/mainPage.html";
    }, 200);
});