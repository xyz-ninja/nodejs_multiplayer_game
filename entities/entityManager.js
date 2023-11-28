
var playersList = {};
var bulletsList = {};

let initPack = {
	players : [],
	bullets : []
};

let removePack = structuredClone(initPack);

function getPlayers() {
	return playersList;
}

function getBullets() {
	return bulletsList;
}

module.exports = {
	initPack : initPack,
	removePack : removePack,
	getBullets: getBullets,
	getPlayers: getPlayers,
}