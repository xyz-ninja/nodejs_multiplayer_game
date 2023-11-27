let Player = require('../entities/player');

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
    setTimeout(function() {
        users[username] = password;
        callback();
    }, 10);
}

function checkUsernameTaken(username, callback) {
    // emit delay
    setTimeout(function() {
	    callback(users[username] !== undefined);	
    }, 10);
}

function checkCredentials(username, password, callback) {
    setTimeout(function() {
	    callback(users[username] === password);
    }, 10);
}

module.exports = {
	onConnect: onConnect,
	addUser: addUser
}