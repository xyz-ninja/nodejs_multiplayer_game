let EntityManager = require('./entityManager');
let Entity = require("./entity");
let Player = require("./player");

class Bullet extends Entity {
	constructor(parentID, angle) {
		super();

		this.id = Math.random();
		this.parentID = parentID;

		this.speedX = Math.cos(angle / 180 * Math.PI) * 10;
		this.speedY = Math.sin(angle / 180 * Math.PI) * 10;

		this.timer = 0;
		this.toRemove = false;
	
		EntityManager.getBullets()[this.id] = this;
	
		EntityManager.initPack.bullets.push({
			id : this.id,
			x : this.x,
			y : this.y,
		});
	}

	static list = {};

	update() {
		this.timer += 1;

		if (this.timer > 100) {
			this.toRemove = true;
		}

		super.update();
	
		let players = EntityManager.getPlayers();
		for (let i in players) {
			let player = players[i];
			if (this.getDistanceTo(player) < 32 && this.parentID !== player.id) {
				this.toRemove = true;
			}
		}
	}

	static updateSocketPack() {
		let pack = [];

		let bullets = EntityManager.getBullets();
		for (let i in bullets) {
			let bullet = bullets[i];
			bullet.update();
			
			if (bullet.toRemove) {
				EntityManager.removePack.bullets.push(this.id);

				delete bullets[i];
			
			} else {
				pack.push({
					id : bullet.id,
					x : bullet.x,
					y : bullet.y
				});
			}
		}

		return pack;
	}
}

module.exports = Bullet;	