
const port = 2000;

var express = require('express');
var app = express();

var server = require('http').Server(app);

require("./entities/entity");
let Player = require("./entities/player");

// редирект с главной ссылки
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

// даёт доступ к файлам внутри папки client через ссылку
app.use('/client', express.static(__dirname + '/client'));
app.use('/libs', express.static(__dirname + '/libs'));

server.listen(2000);

let socketsList = {};

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