class Entity {
    constructor() {
        this.x = 250;
        this.y = 250;
        this.speedX = 0;
        this.speedY = 0;
        this.id = "";
    }

    update() {
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

module.exports = Entity;