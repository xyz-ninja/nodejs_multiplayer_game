let Entity = require("./entity");

class Player extends Entity {
    constructor(id, list) {
        super();
        
        this.id = id;
        this.list = list;
		this.number = "" + Math.floor(10 * Math.random());

        this.isMoveUp = false;
        this.isMoveDown = false;
        this.isMoveLeft = false;
        this.isMoveUp = false;

        this.maxSpeed = 10;

		Player.list[id] = this;
    }

	static list = {};

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
		});
	}

	static onDisconnect(socket) {
		delete Player.list[socket.id];
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

		for (let i in Player.list) {
			let player = Player.list[i];
			player.update();
			
			pack.push({
				x : player.x,
				y : player.y,
				number : player.number
			});
		}

		return pack;
	}
}

module.exports = Player;