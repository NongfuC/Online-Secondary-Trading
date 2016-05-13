var mysql   = require('mysql');
var pool    = {};
var config  = {
  host              : 'localhost',
  user              : 'se',
  password          : '123456',
  database          : 'se_DB',
  multipleStatements: true
};

var pool = mysql.createPool(config);
var db   = {};
db.select = function(sql) {
  var promise = new Promise(function(resolve) {
    pool.getConnection(function(err, connection) {
      if(err) getConErr(err);
      connection.query(sql, function(err, rows) {
        if (err) {
          connection.release(function(err) {
            if (err) closeConErr(err);
          });
          queryErr(err, sql);
        }
        connection.release(function(err) {
          if (err) closeConErr(err);
        });
        resolve(rows);
      });
    });
  });
  return promise;
};
db.insert = function(sql) {
  var promise = new Promise(function(resolve) {
    pool.getConnection(function(err, connection) {
      if(err) getConErr(err);
      connection.query(sql, function(err, result) {
        if (err) {
          connection.release(function(err) {
            if (err) closeConErr(err);
          });
          queryErr(err, sql);
        }
        connection.release(function(err) {
          if (err) closeConErr(err);
        });
        resolve(result);
      });
    });
  });
  return promise;
};
function getConErr(err) {
  throw err + '\n||获取数据库连接异常！';              
}
function closeConErr(err) {
  throw err + '\n||关闭数据库连接异常！';
}
function queryErr(err, sql) {
  throw err +'\n||执行' + sql +'语句异常！';
}
module.exports = db;
