var express = require('express');
var pool = require('../model/db');
var router = express.Router();
var session = require('express-session');
var cookieParse = require('cookie-parser');

/* GET home page. */
router.use(session({
  secret:'userid',
}));
router.use(function(req, res, next){
  // if(req.session.isLogin === 'yes'){
  //   if(req.path === '/reg' 
  //   || req.path === '/doreg' 
  //   || req.path === '/login'
  //   || req.path === '/dologin'){
  //     res.redirect('/');
  //   }
  //   next();
  // }else{
  //   if(req.path === '/reg' 
  //   || req.path === '/doreg' 
  //   || req.path === '/login'
  //   || req.path === '/dologin'){
  //     next();
  //   }else{
  //     res.redirect('/login');
  //   }
  // }
  next();
});


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/reg', function (req, res, next) {
  res.render('register', { title: '注册' });
});
router.post('/doreg', function (req, res, next) {
  var uname = req.body.uname;
  var password = req.body.password;

  pool.getConnection(function (err, connection) {
    if (err) {
      pool.err(err, '获取数据库连接异常！');
    }
    connection.query('select uname from user where uname =\'' + uname + '\'', function (err, rows) {
      if (err) {
        connection.release(function (err) {
          if (err) {
              console.error(err, '关闭数据库连接异常！');
          }
        });
        pool.err(err, '执行SQL查询语句异常！');
      }
      if (rows.length) {
        connection.release(function (err) {
          if (err) {
            pool.err(err, '关闭数据库连接异常！');
          }
        });
        res.send('用户名已存在！');
        console.log(rows[0].uname);
        return;
      }
      connection.query('insert into user (uname, password) values (\'' + uname + '\', \'' + password + '\')', function (err, result) {
        if (err) {
          connection.release(function (err) {
            if (err) {
              console.error(err, '关闭数据库连接异常！');
            }
          });
          pool.err(err, '执行SQL插入语句异常！');
        }
        connection.release(function (err) {
          pool.err(err, '关闭数据库连接异常！');
        });
        res.send('success');
        console.info(result);
      });
    });
  });
});
router.get('/login', function(req, res, next){
  res.render('login', {title: '登陆' });
});
router.post('/dologin', function(req, res, next){
  var uname = req.body.uname;
  var password = req.body.password;
  pool.getConnection(function(err, connection){
    if(err){
      console.error('获取数据库连接异常！', err.stack)
      return;
    }
    connection.query('select uname,password from user where uname = \'' + uname + '\'', function(err, result){
      if(err){
        connection.release(function(err){
          if(err){
            console.error('关闭数据库连接异常！', err.stack);
            return;
          }
        });
        console.error('执行SQL查询语句异常！', err.stack);
        return;
      }
      if(!result.length){
        connection.release(function(err){
          if(err){
            console.error('关闭数据库连接异常！', err.stack);
            return;
          }
        });
        res.send('用户名不存在！');
      }else{
        connection.release(function(err){
          if(err){
            console.error('关闭数据库连接异常！', err.stack);
            return;
          }
        });
        if(result[0].password !== password){
          res.send('密码错误！');
          return;
        }else{
          req.session.isLogin = 'yes';
          res.send('success');
        }
      }
    });
  });
});

module.exports = router;
