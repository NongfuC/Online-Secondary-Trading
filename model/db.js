var mysql = require('mysql');
var pool = {};
var config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'my_db'
};

var pool = mysql.createPool(config);
pool.err = function (err, info) {
	console.error(info);
	throw err;
};

module.exports = pool;