
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