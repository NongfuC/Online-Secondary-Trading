var express = require('express');
var db = require('../model/db');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/reg', function (req, res, next) {
  res.render('register', { title: '注册' });
})
router.post('/doreg', function (req, res, next) {
  var uname = req.body.uname;
  var password = req.body.password;
  db.query('select uname from user where uname =\'' + uname + '\'', function (err, rows) {
    if (rows.length) {
      res.send('用户名已存在！');
      console.log(rows[0].uname);
      return;
    };
    var sql = 'insert into user (uname, password) values (\'' + uname + '\', \'' + password + '\')';
    console.log(sql);
    db.query(sql, function (err, rows) {
      if (err) throw err;
      console.dir(rows);
      res.send('success');
      console.log('success');
    });
  });
})

module.exports = router;
