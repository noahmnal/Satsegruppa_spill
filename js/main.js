const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   // "penselen" vi tegner med
const htmlScore = document.getElementById("score");
const htmlHighScore = document.getElementById("highScore");
       // størrelse på spiller og objekter
        // 0 = venstre, 1 = midten, 2 = høyre
let score = 0;
let speed = 5;         // piksler per steg
let objects = [];      // alle ølbokser og hindringer på brettet
let loop = null;       // spill-løkken, null når spillet står stille
let message = "Trykk mellomrom for å starte";
let spawnRate = 4
let totalLanes = 12;

const beerRate = 100
const hiroRate = 60
let barrelRate = 200

const canvasWidth = 1000
const canvasHeigth = 500
const laneWidht = canvasWidth / totalLanes;    // hvor spilleren står (øverste kant)
const size = canvasWidth / 20;  

const beerImage = new Image();
beerImage.src = "../images/gameDrawings/beerdrawing.png";

const hiroImage = new Image();
hiroImage.src = "../images/gameDrawings/hiroshima.png"

const exphilImage = new Image();
exphilImage.src = "../images/gameDrawings/exphilbok.png"

// Rekord: hentes fra nettleseren (blir 0 første gang)
let highScore = Number(localStorage.getItem("rekord"));
htmlHighScore.textContent = highScore; 

class Player {
    constructor() {
        this.lane = 1
        this.y = 440
        this.x = 100
    }
}

class FallingObject {
    constructor(lane, type) {
        this.lane = lane
        this.y = -50
        this.type = type
    }
}

let player = new Player();
let keysDown = []
// 2. Styring
document.addEventListener("keydown", function (e) {
    let key = e.key.toLowerCase(); // så "A" (Caps Lock/Shift) også virker
    keysDown[key] = true; 
    if (key === " " && loop === null) {
        start();
    }
    draw();
    document.addEventListener("keyup", function (e) {
    keysDown[e.key.toLowerCase()] = false;   // tasten er sluppet
    });
});

function movePlayer() {
    if ((keysDown["arrowup"] || keysDown["w"]) && player.y > 0) {
        player.y -= 10
    }
    if ((keysDown["arrowdown"] || keysDown["s"]) && player.y < canvasHeigth-size) {
        console.log(player.y)
        player.y += 10
    }
    if ((keysDown["arrowleft"] || keysDown["a"]) && player.x > 0) {
        player.x -= 10;
    }
    if ((keysDown["arrowright"] || keysDown["d"]) && player.x < canvasWidth) {
        player.x += 10;
    }
}

let timer = 0
// 3. Spill-løkken: kjøres ca. 33 ganger i sekundet
function mainLoop() {
    if (Math.random() < spawnRate/100) {
        spawnObject()
    };
    moveObjects();
    checkCollisions();
    movePlayer()
    removePassed();
    if (timer % 3 === 0) {
        score ++;
    }
    draw();
    timer++;
}

//returns str type
function dropTable() {
    //add rates here
    const total = beerRate + hiroRate + barrelRate
    const randInt = Math.random()*total
    if (randInt <= beerRate) {
        return "beer"
    }
    if (randInt <= beerRate + hiroRate) {
        return "hiro"
    } 
    //add more here
    else {
        return "barrel"
    }



}

// 4. Lage en ølboks eller et hinder øverst i en tilfeldig bane
//    Nå er et objekt bare data – ingen HTML-element
function spawnObject() {
    let newLane = Math.floor(Math.random() * totalLanes); // 0, 1 eller 2
    objects.push(new FallingObject(newLane, dropTable()));
  
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
        let objX = obj.lane *laneWidht + (laneWidht - size) / 2
        //Collision detection
        if (objX < player.x + size &&
            objX + size > player.x &&
            obj.y < player.y + size &&
            obj.y + size > player.y) {
            //not beer
            switch (obj.type) {
                case "barrel":
                    gameOver();
                    return;
                    break;
                case "beer":
                    score+= 20;
                    break;

                case "hiro":
                    score += 100;
                    break;
            }
            objects.splice(i, 1);
            if (score % 50 === 0) {
                speed++;
                spawnRate++;
                if (barrelRate <= 500) {
                    barrelRate += 10;
                }
            }
        }
            //beer
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
    
    htmlScore.textContent = score
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
            switch (obj.type) {
                case "beer":
                    ctx.drawImage(beerImage, x - size / 2, y - size / 2, size, size);
                    break;
                case "hiro":
                    console.log("hiroooo")
                    ctx.drawImage(hiroImage, x - size / 2, y - size / 2, size*4, size*4);
                    break;
                case "barrel":
                    ctx.drawImage(exphilImage, x - size / 2, y - size / 2, size*4, size*4);
                    break;
            }
    }

    // Spilleren
    ctx.fillStyle = "#4da6ff";
    ctx.fillRect(player.x, player.y, size, size);

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
    message = "";
    loop = setInterval(mainLoop, 30);
}

draw(); // tegn startskjermen