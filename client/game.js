var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

const WIDTH = 500;
const HEIGHT = 500;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

class Player {
	constructor(initPack) {
		this.id = initPack.id;
		this.number = initPack.number;
		this.x = initPack.x;
		this.y = initPack.y;

		Player.list[this.id] = this;
	}

	static list = {};
}

class Bullet {
	constructor(initPack) {
		this.id = initPack.id;
		this.x = initPack.x;
		this.y = initPack.y;
		Bullet.list[this.id] = this;
	}

	static list = {};
}

// init
// update
// remove

socket.on('init', function(data) {
	for (let i = 0; i < data.players.length; i++) {
		new Player(data.players[i]);
	}

	for (let i = 0; i < data.bullets.length; i++) {
		new Bullet(data.bullets[i]);
	}
});

socket.on('update', function(data) {
	for (let i = 0; i < data.players.length; i++) {
		let pack = data.players[i];
		let player = Player.list[pack.id];

		if (player) {
			if (player.x != undefined) {
				player.x = pack.x;
			}
			
			if (player.y != undefined) {
				player.y = pack.y;
			}
		}
	}

	for (let i = 0; i < data.bullets.length; i++) {
		let pack = data.bullets[i];
		let bullet = Bullet.list[pack.id];

		if (bullet) {
			if (bullet.x != undefined) {
				bullet.x = pack.x;
			}
			
			if (bullet.y != undefined) {
				bullet.y = pack.y;
			}
		}
	}
});

socket.on('remove', function(data) {
	for (let i = 0; i < data.players.length; i++) {
		delete Player.list[data.players[i]];
	}

	for (let i = 0; i < data.bullets.length; i++) {
		delete Bullet.list[data.bullets[i]];
	}
});

// update loop
setInterval(function() {
	ctx.clearRect(0, 0, 500, 500);
	
	for (let i in Player.list) {
		let player = Player.list[i];
		ctx.fillText(player.number, player.x, player.y);
	}

	for (let i in Bullet.list) {
		let bullet = Bullet.list[i];
		ctx.fillRect(bullet.x - 5, bullet.y - 5, 10, 10);
	}

}, 100);