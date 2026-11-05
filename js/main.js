const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   // "penselen" vi tegner med
const canvasWidth = 1000;
const canvasHeigth = 500;
const size = canvasWidth / 20;   // grunnstørrelse på spiller og objekter
const traktDuration = 130;

const speedBoostSound = new Audio("../resources/sounds/speedboost.wav");

let score = 0;
let currentPlayerName = "";
let fallingSpeed = 5;          //objects speed
let objects = [];
let popups = []       //list with all objects
let loop = null;        // main loop
let message = "Trykk mellomrom for å starte";
let spawnRate;
let nextLevel; //points to reach next level
let showHitboxes = false;
let trakteTimer = 0
const trakteSpeedBoost = 10
const popLifetime = 30
let isTrakt = false;

// Spawn ratios
let beerRate;
let hiroRate;
let fireBallRate;
let traktRate;
let barrelRate;

// Playtesting stats
const difficulties = [{
        speed: 4, spawnRate: 3, nextLevel: 100,
        beerRate: 100, hiroRate: 10, fireBallRate: 20, traktRate: 7, barrelRate: 120
    }, {
        speed: 5, spawnRate: 4, nextLevel: 80,
        beerRate: 100, hiroRate: 10, fireBallRate: 20, traktRate: 10, barrelRate: 200
    }, {
        speed: 7, spawnRate: 7, nextLevel: 60,
        beerRate: 100, hiroRate: 10, fireBallRate: 20, traktRate: 15, barrelRate: 220
    }, {
        speed: 9, spawnRate: 12, nextLevel: 45,
        beerRate: 60, hiroRate: 30, fireBallRate: 50, traktRate: 25, barrelRate: 170
    }
];

//images
const beerImage = createImage("beerdrawing.png")
const hiroImage = createImage("hiroshima.png")
const exphilImage = createImage("exphilbok.png")
const fireBallImage = createImage("fireball.png")
const traktImage = createImage("trakt.png")
const fire50Image = createImage("50fireball.png")
const fireTextImage = createImage("fireballtext.png")
const hiro100Image = createImage("100hiroshima.png")
const hiroTextImage = createImage("hiroshimatext.png")



function createImage(imgName) {
    const mapPath = "../resources/images/gameDrawings/"
    const img =  new Image() 
    img.src = mapPath + imgName
    return img;
}

// Records
function loadHighScores() {
    const storedScores = localStorage.getItem("highscores");
    if (storedScores === null) {
        return [];
    }

    try {
        const scores = JSON.parse(storedScores);
        if (!Array.isArray(scores)) {
            console.error("Lagrede highscores er ikke en liste.");
            return [];
        }
        return scores
            .map(value => {
                if (Number.isFinite(value) && value > 0) {
                    return { name: "", score: value };
                }
                if (value && typeof value.name === "string" && Number.isFinite(value.score) && value.score > 0) {
                    return value;
                }
                return null;
            })
            .filter(value => value !== null)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    } catch (error) {
        console.error("Kunne ikke lese lagrede highscores.", error);
        return [];
    }
}

const highScores = loadHighScores();
const savedRecord = Number(localStorage.getItem("rekord"));
if (localStorage.getItem("highscores") === null && Number.isFinite(savedRecord) && savedRecord > 0) {
    highScores.push({ name: "", score: savedRecord });
}
let highScore = Math.max(savedRecord || 0, ...highScores.map(entry => entry.score));


class Player {
    constructor() {
        this.x = 100;
        this.y = 440;
        this.w = size;
        this.h = size;
        this.baseMoveSpeed = 14
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
    if (e.target === playerNameInput) {
        return;
    }

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

    if (timer % 10 === 0) {
        score++;
    }

    if (isTrakt) {
        if (timer > trakteTimer + traktDuration) {
            isTrakt = false
            player.speed = player.baseMoveSpeed
            speedBoostSound.currentTime = 0; 
            speedBoostSound.pause()
        }
    } else {
        player.speed = player.baseMoveSpeed
    }
    for (let i = 0; i < popups.length; i++) {
        if (timer > popups[i].deathSentence) {
            popups.splice(i, 1)
        }
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
        obj.y += fallingSpeed;
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
                    new Audio("../resources/sounds/beerclink.wav").play(); // beer-sound
                    score += 20;
                    break;

                case "hiro":
                    new Audio("../resources/sounds/hirobomb.wav").play(); // hiro-lyd
                    score += 100;
                     popups.push({x: obj.x, y:obj.y, type: obj.type, deathSentence: timer+popLifetime})
                    break;

                case "fireball":
                    new Audio("../resources/sounds/firewoosh.wav").play(); // fireball
                    score += 50
                    popups.push({x: obj.x, y:obj.y, type: obj.type, deathSentence: timer+popLifetime})
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
        fallingSpeed++;
        spawnRate++;
        if (barrelRate < 500) {
            barrelRate += 10;
        }
        nextLevel += nextLevel;
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

    for (let p of popups) {
        switch (p.type) {
            case "hiro":
                ctx.drawImage(hiro100Image, p.x-110, p.y-75, size*5.2, size*5.2);
                ctx.drawImage(hiroTextImage, p.x-135, p.y-120, size*6.7, size*5.2);
                break;
            case "fireball":
                ctx.drawImage(fire50Image, p.x-75, p.y-65, size*3.5, size*2.5);
                ctx.drawImage(fireTextImage, p.x-110, p.y-130, size*5.7, size*3.7);
                 break;
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
    if (score > 0) {
        highScores.push({ name: currentPlayerName, score: score });
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(10);
        localStorage.setItem("highscores", JSON.stringify(highScores));
    }
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("rekord", highScore);
    }
    message = "Game over! Du fikk " + score + " poeng.\nTrykk mellomrom for å prøve igjen";
    draw();
}

function start() {
    currentPlayerName = playerNameInput.value.trim();
    const selectedDifficulty = Number(localStorage.getItem("nivå"));
    const d = difficulties[selectedDifficulty] || difficulties[0];
    popups = []  
    objects = [];
    score = 0;
    fallingSpeed = d.speed;
    spawnRate = d.spawnRate;
    nextLevel = d.nextLevel;
    beerRate = d.beerRate;
    hiroRate = d.hiroRate;
    fireBallRate = d.fireBallRate;
    traktRate = d.traktRate;
    barrelRate = d.barrelRate;
    timer = 0;
    player = new Player();
    message = "";
    loop = setInterval(mainLoop, 30);
}

draw();

const nameForm = document.getElementById("nameForm");
const playerNameInput = document.getElementById("playerNameInput");
const playerName = document.getElementById("playerName");

nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    playerName.textContent = playerNameInput.value.trim();
    playerNameInput.blur();
});