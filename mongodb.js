var mongojs = require('mongojs');

let db = mongojs('localhost:27017/exampleGame', ['account', 'progress']);

module.exports = {
	db: db
};