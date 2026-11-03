class HelathBar {
    constructor(x, y, w, h, maxHealth, colour){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxHealth = maxHealth;
        this.maxWidth = w;
        this.health = maxHealth;
        this.colour = colour;
    }
    show(context) {
        context.strokeStyle = "#333";
        context.lineWidth = 4;
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x, this.y, this.maxWidth, this.h);
    }

    updateHealth(val) {
        this.health = val;
        this.w = (this.health / this.maxHealth) * this.maxWidth;
    }
}