const levels = [
    { name: "easy", className: "lett" },
    { name: "medium", className: "medium" },
    { name: "hard", className: "vanskelig" },
    { name: "Fadderuka", className: "fadderuka" }
];
const levelButton = document.getElementById("nivåBtn");
const storedLevel = localStorage.getItem("nivå");
const parsedLevel = Number(storedLevel);
let selectedLevel = storedLevel !== null && Number.isInteger(parsedLevel) && parsedLevel >= 0 && parsedLevel < levels.length
    ? parsedLevel
    : null;

function updateLevelButton() {
    const level = levels[selectedLevel];
    levelButton.textContent = level.name;
    levelButton.className = "gameBtn " + level.className;
}

if (selectedLevel !== null) {
    updateLevelButton();
}

levelButton.addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play();
});

levelButton.addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play();
    selectedLevel = selectedLevel === null ? 0 : (selectedLevel + 1) % levels.length;
    localStorage.setItem("nivå", selectedLevel);
    updateLevelButton();
});
