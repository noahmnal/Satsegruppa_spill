const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   // "penselen" vi tegner med

const laneWidht = 200;
const playerY = 440;    // hvor spilleren står (øverste kant)
const size = 50;         // størrelse på spiller og objekter

let lane = 1;          // 0 = venstre, 1 = midten, 2 = høyre
let score = 0;
let speed = 5;         // piksler per steg
let objects = [];      // alle ølbokser og hindringer på brettet
let loop = null;       // spill-løkken, null når spillet står stille
let message = "Trykk mellomrom for å starte";
let canRatio = 33 //precent amout of cans
let spawnRate = 5

// Rekord: hentes fra nettleseren (blir 0 første gang)
let highScore = Number(localStorage.getItem("rekord"));

class fallingObj {
    constructor(lane, type) {
        this.lane = lane
        this.y = -50
        this.type = type
    }
}


// 2. Styring
document.addEventListener("keydown", function (e) {
    let key = e.key.toLowerCase(); // så "A" (Caps Lock/Shift) også virker

    if ((key === "arrowleft" || key === "a") && lane > 0) {
        lane--;
    }
    if ((key === "arrowright" || key === "d") && lane < 2) {
        lane++;
    }
    if (key === " " && loop === null) {
        start();
    }
    draw();
});

// 3. Spill-løkken: kjøres ca. 33 ganger i sekundet
function mainLoop() {
    if (Math.random() < spawnRate/100) {
        spawnObject()
    };
    moveObjects();
    checkCollisions();
    removePassed();
    draw();
}

// 4. Lage en ølboks eller et hinder øverst i en tilfeldig bane
//    Nå er et objekt bare data – ingen HTML-element
function spawnObject() {
    let newLane = Math.floor(Math.random() * 3); // 0, 1 eller 2
    let type = "beer";
    if (Math.random() < canRatio/100) {
        type = "obstacle";
    }
    objects.push(new fallingObj(newLane, type));
}

// 5. Flytte alle objekter nedover
function moveObjects() {
    for (let obj of objects) {
        obj.y = obj.y + speed;
    }
}

// 6. Kollisjon (baklengs, fordi vi kan fjerne fra lista underveis)
function checkCollisions() {
    for (let i = objects.length - 1; i >= 0; i--) {
        let obj = objects[i];
        //Collision detection
        if (obj.lane === lane &&
            obj.y + size > playerY &&
            obj.y < playerY + size) {
            //not beer
            if (obj.type === "obstacle") {
                gameOver();
                return;
            }
            //beer
            score++;
            if (score % 2 === 0) {
                speed++;
                spawnRate++;
                if (canRatio <= 50) {
                    canRatio++;
                }
                

            }
            objects.splice(i, 1);
        }
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
    // Visk ut hele brettet
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stiplede linjer mellom banene
    ctx.strokeStyle = "#777";
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidht, 0);
        ctx.lineTo(i * laneWidht, canvas.height);
        ctx.stroke();
    }
    ctx.setLineDash([]); // slå av stiplingen igjen

    // Objektene (emoji tegnes som tekst)
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        let x = obj.lane * laneWidht + laneWidht / 2; // midt i banen
        let y = obj.y + size / 2;
        if (obj.type === "beer") {
            ctx.fillText("🍺", x, y);
        } else {
            ctx.fillText("🛢️", x, y);
        }
    }

    // Spilleren
    ctx.fillStyle = "#4da6ff";
    let playerX = lane * laneWidht + (laneWidht - size) / 2;
    ctx.fillRect(playerX, playerY, size, size);

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
    }
    message = "Game over! Du fikk " + score + " poeng.\nTrykk mellomrom for å prøve igjen";
    draw();
}

function start() {
    objects = [];
    score = 0;
    speed = 5;
    lane = 1;
    message = "";
    loop = setInterval(mainLoop, 30);
}

draw(); // tegn startskjermen