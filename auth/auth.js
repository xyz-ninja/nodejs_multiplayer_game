let Player = require('../entities/player');
let Mongo = require('../mongodb');

let users = {
    "admin" : "12345",
    "bob" : "fuckyoubob",
    "bob2" : "fuckyoubob2"
}

function onConnect(socket) {
	socket.on('signIn', function(data) {
            checkCredentials(data.username, data.password, (result) => { 
            if (result) {
                let player = new Player(socket.id);
                Player.onConnect(socket);
            
                socket.emit('signInResponse', {success: true});
            } else {
                socket.emit('signInResponse', {success: false});
            }
        });
    });

	socket.on('signUp', function(data) {
        checkUsernameTaken(data.username, (result) => {
            if (result == false) {
                addUser(data.username, data.password, () => {
                    socket.emit('signUpResponse', {success: true});
                });
            } else {
                socket.emit('signUpResponse', {success: false});
            }
        });
    });
}

function addUser(username, password, callback) {
    Mongo.db.insert({username: username, password: password}, function(err) {
        callback();
    });
}

function checkUsernameTaken(username, callback) {
    Mongo.db.find({username: username}, function(err, result) {
        if (result.length > 0) {
	        callback(true);
        } else {
            callback(false);
        }
    });
}

function checkCredentials(username, password, callback) {
    Mongo.db.find({username: username, password: password}, function(err, result) {
        if (result.length > 0) {
	        callback(true);
        } else {
            callback(false);
        }
    });
}

module.exports = {
	onConnect: onConnect,
	addUser: addUser
}