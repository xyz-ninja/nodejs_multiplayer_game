let EntityManager = require('./entityManager');
let Entity = require("./entity");
let Bullet = require("./bullet");

class Player extends Entity {
    constructor(id, list) {
        super();
        
        this.id = id;
        //this.list = list;
		this.number = "" + Math.floor(10 * Math.random());

        this.isMoveUp = false;
        this.isMoveDown = false;
        this.isMoveLeft = false;
        this.isMoveUp = false;

		this.isShoot = false;
		this.mouseAngle = 0;

        this.maxSpeed = 10;

		EntityManager.getPlayers()[id] = this;

		EntityManager.initPack.players.push({
			id : this.id,
			x : this.x,
			y : this.y,
			number : this.number
		});

		console.log(EntityManager.initPack);
    }

	//static list = {};

	static onConnect(socket) {
		var player = new Player(socket.id);
	
		socket.on('keyPress', function(data) {
			if (data.inputID === "left") {
				player.isMoveLeft = data.state;
			} else if (data.inputID === "right") {
				player.isMoveRight = data.state;
			} else if (data.inputID === "up") {
				player.isMoveUp = data.state;
			} else if (data.inputID === "down") {
				player.isMoveDown = data.state;
			}

			if (data.inputID === "attack") {
				player.isAttack = data.state;
			}
			if (data.inputID === "mouseAngle") {
				player.mouseAngle = data.state;
			}
		});
	}

	static onDisconnect(socket) {
		EntityManager.removePack.players.push(this.id);
		delete EntityManager.getPlayers()[socket.id];
	}

	update() {
		super.update();
		
		if (this.isAttack) {
			this.shootBullet(this.mouseAngle);
		}
	}

    updatePosition() {
        this.updateSpeed();
        super.updatePosition()
    }

    updateSpeed() {
        if (this.isMoveUp) { 
            this.speedY = -this.maxSpeed; 
        } else if (this.isMoveDown) { 
            this.speedY = this.maxSpeed; 
        } else { 
            this.speedY = 0; 
        }

        if (this.isMoveLeft) { 
            this.speedX = -this.maxSpeed; 
        } else if (this.isMoveRight) { 
            this.speedX = this.maxSpeed; 
        } else {
            this.speedX = 0; 
        }
    }

	static updateSocketPack() {
		let pack = [];

		let players = EntityManager.getPlayers();
		for (let i in players) {
			let player = players[i];
			player.update();
			
			pack.push({
				id : player.id,
				x : player.x,
				y : player.y
			});
		}

		return pack;
	}

	shootBullet(angle) {
		let bullet = new Bullet(this.id, angle);
		bullet.x = this.x;
		bullet.y = this.y;
	}
}

module.exports = Player;