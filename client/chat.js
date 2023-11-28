let chatText = document.getElementById("chat-text");
let chatForm = document.getElementById("chat-form");
let chatInput = document.getElementById("chat-input");

chatForm.onsubmit = function(event) {
	event.preventDefault();
	socket.emit('sendMessageToServer', chatInput.value);
	chatInput.value = '';
};

socket.on('addToChat', function(data) {
	chatText.innerHTML += '<div>' + data + '</div>';
});