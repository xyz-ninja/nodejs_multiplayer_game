
const port = 2000;

var express = require('express');
var app = express();

var server = require('http').Server(app);

// редирект с главной ссылки
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

// даёт доступ к файлам внутри папки client через ссылку
app.use('/client', express.static(__dirname + '/client'));
app.use('/libs', express.static(__dirname + '/libs'));

server.listen(2000);

let socketsList = {};
//let playersList = {};

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
}

console.log("Server started");

var io = require('socket.io') (server, {
    cors: {
        origin: "http://localhost:2000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.sockets.on('connection', function(socket) {
    console.log("Sockets connection established");

    socket.id = Math.random();
    socketsList[socket.id] = socket;

    let player = new Player(socket.id);

	Player.onConnect(socket);

	socket.on('disconnect', function() {
		delete socketsList[socket.id];
		//delete playersList[socket.id];
		Player.onDisconnect(socket);
	});
    //playersList[socket.id] = player;
});

let mainloopDelay = 100 / 25;

setInterval(function() {
	let pack = Player.updateSocketPack();

    for (let i in socketsList) {
        let socket = socketsList[i];
        socket.emit('newPositions', pack);
    }

}, mainloopDelay);