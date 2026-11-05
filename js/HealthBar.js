class HealthBar {
    constructor(elementId, maxHealth) {
        this.element = document.getElementById(elementId);
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    updateHealth(val) {
        this.health = val;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        if (this.health < 0) {
            this.health = 0;
        }
        this.element.style.width = (this.health / this.maxHealth) * 100 + "%";
    }

    addHealth(amount) {
        this.updateHealth(this.health + amount);
    }

    removeHealth(amount) {
        this.updateHealth(this.health - amount);
    }
}