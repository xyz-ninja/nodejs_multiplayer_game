
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
    socket.x = 0;
    socket.y = 0;
    socket.number = "" + Math.floor(10 * Math.random());

    socketsList[socket.id] = socket;

    socket.on('disconnect', function() {
        delete socketsList[socket.id];
    });
});

let mainloopDelay = 100 / 25;

setInterval(function() {

    let pack = [];

    for (let i in socketsList) {
        let socket = socketsList[i];
        socket.x += 1;
        socket.y += 1;
        
        pack.push({
            x : socket.x,
            y : socket.y,
            number : socket.number
        });
    }

    for (let i in socketsList) {
        let socket = socketsList[i];
        socket.emit('newPositions', pack);
    }

}, mainloopDelay);