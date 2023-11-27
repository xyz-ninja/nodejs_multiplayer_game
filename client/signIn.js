let signForm = document.getElementById("sign-form");
let signFormUsername = document.getElementById("sign-form-username");
let signFormPassword = document.getElementById("sign-form-password");
let signFormSignInButton = document.getElementById("sign-form-signIn");
let signFormSignUpButton = document.getElementById("sign-form-signUp");

let gameContainer = document.getElementById("game-container");

signFormSignInButton.onclick = function() {
	socket.emit('signIn', {
		username: signFormUsername.value,
		password: signFormPassword.value
	});
}

signFormSignUpButton.onclick = function() {
	socket.emit('signUp', {
		username: signFormUsername.value,
		password: signFormPassword.value
	});
}

socket.on('signInResponse', function(data) {
	if (data.success) {
		signForm.style.display = 'none';
		gameContainer.style.display = 'inline-block';
	} else {
		alert("Wrong username or password");
	}
});

socket.on('signUpResponse', function(data) {
	if (data.success) {
		alert("Sign up successfully!");
	} else {
		alert("Username already taken");
	}
});