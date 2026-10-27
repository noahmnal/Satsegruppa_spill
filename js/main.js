const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   // "penselen" vi tegner med
const htmlScore = document.getElementById("score");
const htmlHighScore = document.getElementById("highScore");

const canvasWidth = 1000;
const canvasHeigth = 500;
const size = canvasWidth / 20;   // grunnstørrelse på spiller og objekter

let score = 0;
let speed = 5;          //objects speed
let objects = [];       //list with all objects
let loop = null;        // main loop
let message = "Trykk mellomrom for å starte";
let spawnRate = 4;
let nextLevel = 50; //points to reach next level
let showHitboxes = false;
let trakteTimer = 0
const trakteSpeedBoost = 10
let isTrakt = false;

// Spawn ratios
const beerRate = 100;
const hiroRate = 30;
const fireBallRate = 40
const traktRate = 200;
let barrelRate = 150;

//images
const beerImage = new Image();
const mapPath = "../resources/images/gameDrawings/"
beerImage.src = mapPath + "beerdrawing.png";

const hiroImage = new Image();
hiroImage.src = mapPath + "hiroshima.png";

const exphilImage = new Image();
exphilImage.src = mapPath + "exphilbok.png";

const fireBallImage = new Image();
fireBallImage.src = mapPath + "fireball.png"

const traktImage = new Image();
traktImage.src = mapPath + "trakt.png"

// Records
let highScore = Number(localStorage.getItem("rekord"));
htmlHighScore.textContent = highScore;


class Player {
    constructor() {
        this.x = 100;
        this.y = 440;
        this.w = size;
        this.h = size;
        this.baseMoveSpeed = 10
        this.speed = this.baseMoveSpeed
    }
}

class FallingObject {
    constructor(x, type) {
        this.x = x;
        this.y = -50;
        this.type = type;
        switch (type) {
            case "beer":
                this.w = size
                this.h = size
                break;
            case "hiro":
                this.w = size*0.9
                this.h = size
                break;
            case "barrel":
                this.w = size*1.5
                this.h = size*1.6
                break;
            case "fireball":
                this.w = size*0.6
                this.h = size*0.9
                break;
            case "trakt":
                this.w = size*1.1
                this.h = size*1.7
        }
    }
}

let player = new Player();
let keysDown = {};

// 2. movement, using keysDown[] to allow user to hold down the button
document.addEventListener("keydown", function (e) {
    let key = e.key.toLowerCase();
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
    keysDown[e.key.toLowerCase()] = false;
});


function movePlayer() {
    if ((keysDown["arrowup"] || keysDown["w"]) && player.y > 0) {
        player.y -= player.speed;
    }
    if ((keysDown["arrowdown"] || keysDown["s"]) && player.y < canvasHeigth - player.h) {
        player.y += player.speed;
    }
    if ((keysDown["arrowleft"] || keysDown["a"]) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keysDown["arrowright"] || keysDown["d"]) && player.x < canvasWidth - player.w) {
        player.x += player.speed;
    }
}

let timer = 0;

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

    if (isTrakt) {
        if (timer > trakteTimer + 100) {
            isTrakt = false
            player.speed = player.baseMoveSpeed
        }
    } else {
        player.speed = player.baseMoveSpeed
    }
    checkLevelUp();
    draw();
    timer++;
    console.log(player.speed)
}

// 
function dropTable() {
    const total = beerRate + hiroRate + barrelRate + fireBallRate + traktRate;
    const randInt = Math.random() * total;

    if (randInt < beerRate) {
        return "beer";
    }
    if (randInt < beerRate + hiroRate) {
        return "hiro";
    }
    if (randInt < beerRate + hiroRate + fireBallRate) {
         return "fireball";
    }
    if (randInt < beerRate + hiroRate + fireBallRate + traktRate) {
        return "trakt"
    }
    return "barrel"
}

//spawns an object at the top of the screen
function spawnObject() {
    let obj = new FallingObject(0, dropTable());
    obj.x = Math.random() * (canvasWidth - obj.w);  // holder seg innenfor brettet
    objects.push(obj);
}

function moveObjects() {
    for (let obj of objects) {
        obj.y += speed;
    }
}

//checks hitboxes
function overlaps(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}

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
                case "fireball":
                    score += 50
                    break;
                case "trakt":
                    isTrakt = true
                    trakteTimer = timer
                    player.speed += trakteSpeedBoost
                    break;
            }
            objects.splice(i, 1);   // removes hit object
        }
    }
}

//Increaces level and diff
function checkLevelUp() {
    while (score >= nextLevel) {
        speed++;
        spawnRate++;
        if (barrelRate < 500) {
            barrelRate += 10;
        }
        nextLevel += 100;
    }
}

function removePassed() {
    for (let i = objects.length - 1; i >= 0; i--) {
        if (objects[i].y > canvas.height) {
            objects.splice(i, 1);
        }
    }
}

function draw() {
    htmlScore.textContent = score;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let obj of objects) {
        switch (obj.type) {
            case "beer":
                ctx.drawImage(beerImage, obj.x, obj.y, obj.w, obj.h);
                break;
            case "hiro":
                ctx.drawImage(hiroImage, obj.x-110, obj.y-45, size*5.2, size*3.2);
                break;
            case "barrel":
                ctx.drawImage(exphilImage, obj.x-70, obj.y-15, size*4.5, size*2.5);
                break;
            case "fireball":
                 ctx.drawImage(fireBallImage, obj.x-75, obj.y-65, size*3.5, size*2.5);
                 break;
            case "trakt":
                 ctx.drawImage(traktImage, obj.x-173, obj.y-75, size*10, size*6.5);
        }
    }

    ctx.fillStyle = "#4da6ff";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Hitboxes
    if (showHitboxes) {
        ctx.lineWidth = 2;
        for (let obj of objects) {
            ctx.strokeStyle = obj.type === "barrel" ? "red" : "lime";
            ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        }
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(player.x, player.y, player.w, player.h);
    }

    // Points and records
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Poeng: " + score, 10, 10);
    ctx.textAlign = "right";
    ctx.fillText("Rekord: " + highScore, canvas.width - 10, 10);

    // start / end msg
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

draw();