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

    getDistanceTo(entity) {
        return Math.sqrt(Math.pow(this.x - entity.x, 2) + Math.pow(this.y - entity.y, 2));
    }
}

module.exports = Entity;