
var playersList = {};
var bulletsList = {};

function getPlayers() {
	return playersList;
}

function getBullets() {
	return bulletsList;
}

module.exports = {
	getBullets: getBullets,
	getPlayers: getPlayers
}