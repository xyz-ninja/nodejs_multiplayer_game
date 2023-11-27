
let users = {
    "admin" : "12345",
    "bob" : "fuckyoubob",
    "bob2" : "fuckyoubob2"
}

function isValidPassword(username, password) {
	return users[username] === password;
}

module.exports = {
	isValidPassword: isValidPassword
}