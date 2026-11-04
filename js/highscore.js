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
        entry.textContent = score + " poeng";
        highscoreList.appendChild(entry);
    }
}
