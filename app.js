
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
let playersList = {};

class Player {
    constructor(id) {
        this.x = 250;
        this.y = 250;
        this.id = id;
        this.number = "" + Math.floor(10 * Math.random());

        this.isMoveUp = false;
        this.isMoveDown = false;
        this.isMoveLeft = false;
        this.isMoveUp = false;

        this.maxSpeed = 10;
    }

    updatePosition() {
        if (this.isMoveUp) { this.y -= this.maxSpeed; }
        if (this.isMoveDown) { this.y += this.maxSpeed; }
        if (this.isMoveLeft) { this.x -= this.maxSpeed; }
        if (this.isMoveRight) { this.x += this.maxSpeed; }
        console.log("x: " + this.x + ", y: " + this.y);
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
    playersList[socket.id] = player;

    socket.on('disconnect', function() {
        delete socketsList[socket.id];
        delete playersList[socket.id];
    });

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
});

let mainloopDelay = 100 / 25;

setInterval(function() {

    let pack = [];

    for (let i in playersList) {
        let player = playersList[i];
        player.updatePosition();
        
        pack.push({
            x : player.x,
            y : player.y,
            number : player.number
        });
    }

    for (let i in socketsList) {
        let socket = socketsList[i];
        socket.emit('newPositions', pack);
    }

}, mainloopDelay);