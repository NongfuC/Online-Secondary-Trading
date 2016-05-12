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
pool.select = function(sql) {
  pool.getConnection(function(err, connection) {
    if(err) throw err + '\n||获取数据库连接异常！';
    connection.query(sql, function(err, rows) {
      if (err) {
        connection.release(function(err) {
          if (err) throw err + '\n||关闭数据库连接异常！';
        });
        throw err + '\n||执行' + sql +'查询语句异常！';
      }
      connection.release(function(err) {
        if (err) throw err + '\n||关闭数据库连接异常！';
      });
      return rows;
    });
  });
};
pool.insert = function(sql) {
  pool.getConnection(function(err, connection) {
    if(err) throw err + '\n||获取数据库连接异常！';
    connection.query(sql, function(err, result) {
      if (err) {
        connection.release(function(err) {
          if (err) throw err + '\n||关闭数据库连接异常！';
        });
        throw err +'\n||执行SQL插入语句异常！';
      }
      connection.release(function(err) {
        if (err) throw err + '\n||关闭数据库连接异常！';
      });
      return result;
    });
  });
};
module.exports = pool;
