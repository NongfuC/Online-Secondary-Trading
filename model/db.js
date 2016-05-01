var mysql = require('mysql');
var pool = {};
var config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'my_db'
};

var pool = mysql.createPool(config);

var db = {};
db.query = function query(sql, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.error('db-获取数据库连接异常！');
			throw err;
		}
		connection.query(sql, function(err, rows){
			if(err){
				console.error('db-执行语句异常！');
				throw err;
			}
			callback(err, rows);
			connection.release(function(error) {
				if(error) {
						console.error('db-关闭数据库连接异常！');
						throw error;
				}
			});
		});
	});
};

module.exports = db;