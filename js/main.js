const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   // "penselen" vi tegner med
const htmlScore = document.getElementById("score");
const htmlHighScore = document.getElementById("highScore");

const canvasWidth = 1000;
const canvasHeigth = 500;
const size = canvasWidth / 20;   // grunnstørrelse på spiller og objekter

let score = 0;
let speed = 5;          // piksler per steg
let objects = [];       // alle objekter som faller
let loop = null;        // spill-løkken, null når spillet står stille
let message = "Trykk mellomrom for å starte";
let spawnRate = 4;      // prosent sjanse for nytt objekt per steg
let nextLevel = 50;     // poeng som trengs for neste fartsøkning
let showHitboxes = false;

// Sjanser for hver type (vektet)
const beerRate = 100;
const hiroRate = 60;
let barrelRate = 200;

const beerImage = new Image();
beerImage.src = "../images/gameDrawings/beerdrawing.png";

const hiroImage = new Image();
hiroImage.src = "../images/gameDrawings/hiroshima.png";

const exphilImage = new Image();
exphilImage.src = "../images/gameDrawings/exphilbok.png";

// Rekord: hentes fra nettleseren (blir 0 første gang)
let highScore = Number(localStorage.getItem("rekord"));
htmlHighScore.textContent = highScore;

class Player {
    constructor() {
        this.x = 100;
        this.y = 440;
        this.w = size;
        this.h = size;
    }
}

class FallingObject {
    constructor(x, type) {
        this.x = x;
        this.y = -50;
        this.type = type;
        this.w = type === "beer" ? size : size * 2;  // størrelse per type
        this.h = this.w;
    }
}

let player = new Player();
let keysDown = {};

// 2. Styring
document.addEventListener("keydown", function (e) {
    let key = e.key.toLowerCase(); // så "A" (Caps Lock/Shift) også virker
    keysDown[key] = true;

    if (key === " " && loop === null) {
        start();
    }
    if (key === "h") {
        showHitboxes = !showHitboxes;
    }
    draw();
});

document.addEventListener("keyup", function (e) {
    keysDown[e.key.toLowerCase()] = false;   // tasten er sluppet
});

function movePlayer() {
    if ((keysDown["arrowup"] || keysDown["w"]) && player.y > 0) {
        player.y -= 10;
    }
    if ((keysDown["arrowdown"] || keysDown["s"]) && player.y < canvasHeigth - player.h) {
        player.y += 10;
    }
    if ((keysDown["arrowleft"] || keysDown["a"]) && player.x > 0) {
        player.x -= 10;
    }
    if ((keysDown["arrowright"] || keysDown["d"]) && player.x < canvasWidth - player.w) {
        player.x += 10;
    }
}

let timer = 0;
// 3. Spill-løkken: kjøres ca. 33 ganger i sekundet
function mainLoop() {
    if (Math.random() < spawnRate / 100) {
        spawnObject();
    }
    moveObjects();
    movePlayer();
    checkCollisions();
    if (loop === null) return;   // spillet ble avsluttet i checkCollisions
    removePassed();

    if (timer % 3 === 0) {
        score++;
    }
    checkLevelUp();
    draw();
    timer++;
}

// Returnerer en tilfeldig type, vektet etter ratene
function dropTable() {
    const total = beerRate + hiroRate + barrelRate;
    const randInt = Math.random() * total;

    if (randInt < beerRate) {
        return "beer";
    }
    if (randInt < beerRate + hiroRate) {
        return "hiro";
    }
    return "barrel";
}

// 4. Lage et nytt objekt på en tilfeldig x-posisjon øverst
function spawnObject() {
    let obj = new FallingObject(0, dropTable());
    obj.x = Math.random() * (canvasWidth - obj.w);  // holder seg innenfor brettet
    objects.push(obj);
}

// 5. Flytte alle objekter nedover
function moveObjects() {
    for (let obj of objects) {
        obj.y += speed;
    }
}

// Sjekker om to rektangler overlapper
function overlaps(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}

// 6. Kollisjon (baklengs, fordi vi kan fjerne fra lista underveis)
function checkCollisions() {
    for (let i = objects.length - 1; i >= 0; i--) {
        let obj = objects[i];

        if (overlaps(player, obj)) {
            switch (obj.type) {
                case "barrel":
                    gameOver();
                    return;
                case "beer":
                    score += 20;
                    break;
                case "hiro":
                    score += 100;
                    break;
            }
            objects.splice(i, 1);   // fjern bare det du traff
        }
    }
}

// Øker vanskelighetsgraden hver 50. poeng
function checkLevelUp() {
    while (score >= nextLevel) {
        speed++;
        spawnRate++;
        if (barrelRate < 500) {
            barrelRate += 10;
        }
        nextLevel += 50;
    }
}

// 7. Fjerne objekter som har passert bunnen
function removePassed() {
    for (let i = objects.length - 1; i >= 0; i--) {
        if (objects[i].y > canvas.height) {
            objects.splice(i, 1);
        }
    }
}

// 8. Tegne alt på canvas
function draw() {
    htmlScore.textContent = score;

    // Visk ut hele brettet
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Objektene
    for (let obj of objects) {
        switch (obj.type) {
            case "beer":
                ctx.drawImage(beerImage, obj.x, obj.y, obj.w, obj.h);
                break;
            case "hiro":
                ctx.drawImage(hiroImage, obj.x, obj.y, obj.w, obj.h);
                break;
            case "barrel":
                ctx.drawImage(exphilImage, obj.x, obj.y, obj.w, obj.h);
                break;
        }
    }

    // Spilleren
    ctx.fillStyle = "#4da6ff";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Hitboxer (trykk H)
    if (showHitboxes) {
        ctx.lineWidth = 2;
        for (let obj of objects) {
            ctx.strokeStyle = obj.type === "barrel" ? "red" : "lime";
            ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        }
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(player.x, player.y, player.w, player.h);
    }

    // Poeng og rekord
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Poeng: " + score, 10, 10);
    ctx.textAlign = "right";
    ctx.fillText("Rekord: " + highScore, canvas.width - 10, 10);

    // Melding (start / game over)
    if (message !== "") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 180, canvas.width, 120);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let lines = message.split("\n"); // canvas bryter ikke linjer selv
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], canvas.width / 2, 220 + i * 28);
        }
    }
}

function gameOver() {
    clearInterval(loop);
    loop = null;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("rekord", highScore);
        htmlHighScore.textContent = highScore;
    }
    message = "Game over! Du fikk " + score + " poeng.\nTrykk mellomrom for å prøve igjen";
    draw();
}

function start() {
    objects = [];
    score = 0;
    speed = 5;
    spawnRate = 4;
    barrelRate = 200;
    nextLevel = 50;
    timer = 0;
    player = new Player();
    message = "";
    loop = setInterval(mainLoop, 30);
}

draw(); // tegn startskjermen