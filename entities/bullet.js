let Entity = require("./entity");

class Bullet extends Entity {
	constructor(angle) {
		super();

		this.id = Math.random();
		this.speedX = Math.cos(angle / 180 * Math.PI) * 10;
		this.speedY = Math.sin(angle / 180 * Math.PI) * 10;

		this.timer = 0;
		this.toRemove = false;
	
		Bullet.list[this.id] = this;
	}

	static list = {};

	update() {
		this.timer += 1;

		if (this.timer > 100) {
			this.toRemove = true;
		}

		super.update();
	}

	static updateSocketPack() {
		let pack = [];

		for (let i in Bullet.list) {
			let bullet = Bullet.list[i];
			bullet.update();
			
			pack.push({
				x : bullet.x,
				y : bullet.y
			});
		}

		return pack;
	}
}

module.exports = Bullet;	