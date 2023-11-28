var mongojs = require('mongojs');

class MongoDB {
	constuctor() {
		this.db = mongojs('localhost:27017/exampleGame', ['account', 'progress']);
	}
}

module.exports = MongoDB;