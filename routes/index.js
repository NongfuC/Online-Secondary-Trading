var express     = require('express');
var pool        = require('../model/db');
var session     = require('express-session');
var cookieParse = require('cookie-parser');
var formidable  = require('formidable');
var fs          = require('fs');

var router      = express.Router();

/* GET home page. */
router.use(session({
  secret: 'userid',
}));
router.use(function(req, res, next) {
  if(req.session.username){
    if(
         req.path === '/reg'
      || req.path === '/doreg'
      || req.path === '/login'
      || req.path === '/dologin'){
      res.redirect('/');
    }
    next();
  }else if(
       req.path === '/'
    || req.path === '/reg'
    || req.path === '/doreg'
    || req.path === '/login'
    || req.path === '/dologin'){
    next();
  }else{
    res.redirect('/login');
  }
});


router.get('/', function(req, res, next) {
  res.render('index', {
    title   : '首页',
    username: req.session.username,
    school  : req.session.school
  });
});
router.get('/reg', function(req, res, next) {
  res.render('register', {
    title: '注册'
  });
});
router.post('/doreg', function(req, res, next) {
  var uname     = req.body.uname;
  var password  = req.body.password;
  var school    = req.body.school;
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err, '获取数据库连接异常！');
    }
    connection.query('select username from user where username =\'' + uname + '\'', function(err, rows) {
      if (err) {
        connection.release(function(err) {
          if (err) {
            console.error(err, '关闭数据库连接异常！');
          }
        });
        console.err(err, '执行SQL查询语句异常！');
      }
      if (rows.length) {
        connection.release(function(err) {
          if (err) {
            console.error(err, '关闭数据库连接异常！');
          }
        });
        res.send('用户名已存在！');
        console.log(rows[0].username);
        return;
      }
      connection.query(
        'insert into user ('
        + 'username,'
        + 'password,'
        + 'school'
        + ') values ('
        + '\'' + uname     + '\','
        + '\'' + password  + '\','
        + '\'' + school    + '\')'
        , function(err, result) {
        if (err) {
          connection.release(function(err) {
            if (err) {
              console.error(err, '关闭数据库连接异常！');
            }
          });
          console.error(err, '执行SQL插入语句异常！');
        }
        connection.release(function(err) {
          console.error(err, '关闭数据库连接异常！');
        });
        req.session.username  = uname;
        req.session.school    = school;
        res.send('success');
      });
    });
  });
});
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: '登陆'
  });
});
router.post('/dologin', function(req, res, next) {
  var uname     = req.body.uname;
  var password  = req.body.password;
  pool.getConnection(function(err, connection) {
    if (err) throw err + '||获取数据库连接异常！';
    connection.query(
      'select username,password,school from user where username = \'' + uname + '\'', function(err, result) {
      if (err) {
        connection.release(function(err) {
          if (err) throw err + '||关闭数据库连接异常！';
        });
        throw err + '||执行SQL查询语句异常！';
      }
      if (!result.length) {
        connection.release(function(err) {
          if (err) throw err + '||关闭数据库连接异常！';
        });
        res.send('用户名不存在！');
      } else {
        connection.release(function(err) {
          if (err) throw err + '||关闭数据库连接异常！';
        });
        if (result[0].password !== password) {
          res.send('密码错误！');
          return;
        } else {
          req.session.username  = uname;
          req.session.school    = result[0].school;
          res.send('success');
        }
      }
    });
  });
});
router.get('/logout',function(req, res, next) {
   req.session.destroy();
   res.redirect('/')
});
router.get('/upload', function(req, res, next) {
  res.render('upload', {
    title   : 'UPLOAD',
    username: req.session.username,
    school  : req.session.school
  });
});
router.post('/upload', function(req, res, next) {
  var body        = req.body;
  var username    = req.session.username;
  var gname       = body.gname;
  var school      = body.school;
  var category    = body.category;
  var way         = body.way;
  var ex_goods    = body.ex_goods || '';
  var ex_price    = body.ex_price || 0;
  var description = body.description;
  res.send('asdasdasdasdasdad');
  pool.getConnection(function(err, connection) {
    if (err) throw err + '|| 获取数据库连接异常！';
    var sql 
    = 'insert into goods('
    + 'gname,'
    + 'school,'
    + 'category,'
    + 'way,'
    + 'ex_goods,'
    + 'ex_price,'
    + 'description,'
    + 'username'
    + ')values('
    + '\'' + gname        + '\','
    + '\'' + school       + '\','
    + '\'' + category     + '\','
    + '\'' + way          + '\','
    + '\'' + ex_goods     + '\','
           + ex_price     + ','
    + '\'' + description  + '\','
    + '\'' + username     + '\''
    + ')';
    connection.query(sql, function(err, result) {
      if (err) {
        connection.release(function(err) {
          if (err) throw err + '|| 关闭数据库连接异常！';
        });
        throw err + '|| 执行SQL插入语句异常！';
      }
      var imgs = req.session.imgs;
      sql = '';
      for(var i = 0, len = imgs.length; i < len; i++) {
        sql += 'insert into img(src, G_ID) values(' + '\'' + imgs[i] + '\',' + result.insertId + ');';
      }
      connection.query(sql, function(err, result) {
        if (err) throw err + '|| 执行SQL插入语句异常！';
      });
      connection.release(function(err) {
        if (err) throw err + '|| 关闭数据库连接异常！';
      });
    });
  });
});
router.post('/uploadImg', function(req, res, next) {
  var uploadDir       = './imgs/';
  var form            = new formidable.IncomingForm();
  form.encoding       = 'utf-8';
  form.uploadDir      = uploadDir;
  form.multiples      = true;
  form.keepExtensions = true;
  form.maxFieldsSize  = 2 * 1024 * 1024;
  form.parse(req, function(err, fields, files) {
    if (err) throw err;
  });
  form.onPart = function(part) {
    if (part.name && !part.filename) {
      form.handlePart(part);
    }
    if (!part.filename) {
      res.send('文件为空！');
      return;
    } else
    if (!part.mime.match(/^image\//)) {
      res.send('请选择图片上传！');
      return;
    } else
    if (form.bytesExpected > 1024 * 1024) {
      res.send('文件大于1M！');
      return;
    } else {
      form.handlePart(part);
    }
  };
  /**
   *文件上传完成后才执行
   */
  form.on('file', function(name, file) {
    var suffix    = file.type.match(/\/(\w+)$/)[1];
    var tempName  = file.path;
    var tarName   = uploadDir + Date.now() + Math.round(Math.random() * 10000) + '.' + suffix;
    fs.rename(tempName, tarName);
    if(!req.session.imgs){
      req.session.imgs = [];
    }
    req.session.imgs.push(tarName);
    res.send({
      imgUrl: tarName
    });
  });
});
router.get('/publish', function(req, res, nect) {
  res.render('publish', {
    title   : '发布物品',
    username: req.session.username,
    school  : req.session.school
  });
});
router.post('/delete', function(req, res, next) {
  var img = req.body.img;
  fs.unlink(img, function(err) {
    if (err) {
      return console.error(err);
    }
    var imgs = req.session.imgs;
    imgs.splice(imgs.indexOf(img), 1);
    res.send('success');
    console.log(img, '删除成功！');
  });
});
module.exports = router;
