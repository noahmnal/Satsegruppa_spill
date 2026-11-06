document.getElementById("tilbakeBtn").addEventListener("mouseenter", () => {
    new Audio("../resources/sounds/hoverclick.wav").play(); // hover-lyd
});
document.getElementById("tilbakeBtn").addEventListener("click", () => {
    new Audio("../resources/sounds/clickmain.wav").play(); // klikk-lyd
    setTimeout(() => {
        window.location.href = "../html/mainPage.html";
    }, 200);
});



document.getElementById("Fridtjof").addEventListener("click", () => {
    localStorage.setItem("char", 0)
     window.location.href = "../html/mainPage.html";
})

document.getElementById("Noah").addEventListener("click", () => {
    localStorage.setItem("char", 1)
     window.location.href = "../html/mainPage.html";

})
document.getElementById("Sander").addEventListener("click", () => {
    localStorage.setItem("char", 2)
     window.location.href = "../html/mainPage.html";
})
document.getElementById("Fredrik").addEventListener("click", () => {
    localStorage.setItem("char", 3)
     window.location.href = "../html/mainPage.html";
})
document.getElementById("Caspar").addEventListener("click", () => {
    localStorage.setItem("char", 4)
     window.location.href = "../html/mainPage.html";
})