const healthBar = new HealthBar("liv", 100);

document.getElementById("minusKnapp").onclick = function () {
    healthBar.removeHealth(10);
    if (healthBar.health <= 0) {
        document.getElementById("melding").textContent = "Du døde";
    }
}

document.getElementById("livKnapp").onclick = function () {
    if (healthBar.health > 0) {
        healthBar.addHealth(10);
    }
}