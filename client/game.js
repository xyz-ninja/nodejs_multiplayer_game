let chatText = document.getElementById("chat-text");
let chatForm = document.getElementById("chat-form");
let chatInput = document.getElementById("chat-input");

var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

const WIDTH = 500;
const HEIGHT = 500;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

chatForm.onsubmit = function(event) {
	event.preventDefault();
	socket.emit('sendMessageToServer', chatInput.value);
	chatInput.value = '';
};

socket.on('addToChat', function(data) {
	chatText.innerHTML += '<div>' + data + '</div>';
});

socket.on('newPositions', function(data) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	// update players
	for (let i = 0; i < data.players.length; i++) {
		let currentData = data.players[i];
		ctx.fillText(currentData.number, currentData.x, currentData.y);
	}

	// update bullets
	for (let i = 0; i < data.bullets.length; i++) {
		let currentData = data.bullets[i];
		ctx.fillRect(currentData.x - 5, currentData.y - 5, 10, 10);
	}
});

// update input
document.onkeydown = function(event) {
	let inputID = "";

	if (event.keyCode === 68) {
		inputID = "right";
	} else if (event.keyCode === 83) {
		inputID = "down";
	} else if (event.keyCode === 65) {
		inputID = "left";
	} else if (event.keyCode === 87) {
		inputID = "up";
	}

	if (inputID != "") {
		socket.emit('keyPress', {inputID: inputID, state: true});
	}
}

document.onkeyup = function(event) {
	let inputID = "";
	if (event.keyCode === 68) {
		inputID = "right";
	} else if (event.keyCode === 83) {
		inputID = "down";
	} else if (event.keyCode === 65) {
		inputID = "left";
	} else if (event.keyCode === 87) {
		inputID = "up";
	}

	if (inputID != "") {
		socket.emit('keyPress', {inputID: inputID, state: false});
	}
}

// attack
document.onmousedown = function(event) {
	socket.emit('keyPress', {inputID: "attack", state: true});
}

document.onmouseup = function(event) {
	socket.emit('keyPress', {inputID: "attack", state: false});
}

document.onmousemove = function(event) {
	let x = -HALF_WIDTH + event.clientX - 8;
	let y = -HALF_HEIGHT + event.clientY - 8;
	let angle = (Math.atan2(y, x) / Math.PI * 180);

	//console.log(angle);

	socket.emit('keyPress', {inputID: "mouseAngle", state: angle});
}