var express     = require('express');
var db          = require('../model/db');
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
    || req.path === '/dologin'
    || req.path === '/detail'){
    next();
  }else{
    res.redirect('/login');
  }
});


router.get('/', function(req, res, next) {
  db.select(
    'select * from (select * from goods where category =\'二手电脑\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'二手手机\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'数码产品\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'生活用品 \') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'小家电\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'图书/音像\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'文体用品\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  + 'select * from (select * from goods where category =\'其他\') a inner join img b on a.G_ID = b.G_ID order by a.G_ID desc limit 5;'
  )
  .then(function(goods) { 
    res.render('index', {
      title   : '首页',
      username: req.session.username,
      school  : req.session.school,
      goods   : goods
    });
  });
});
router.get('/detail', function(req, res, next) {
  db.select('select * from goods where G_ID=' +req.query.id)
  .then(function(goods) { return goods; })
  .then(function(goods) {
    db.select('select src from img where G_ID=' +req.query.id)
    .then(function(imgs) { return {goods: goods[0], imgs: imgs }})
    .then(function(result) {
      db.select('select * from user where username=\'' + result.goods.username + '\'')
      .then(function(user) {
        console.log(user);
        res.render('detail', {
          title   : '物品详情',
          username: req.session.username,
          school  : req.session.school,
          goods   : result.goods,
          imgs    : result.imgs,
          user    : user[0]
        });
      });
    });
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
  db.select('select username from user where username =\'' + uname + '\'')
  .then(function(result) {
    if(result.length){
      res.send('用户名已存在！');
    }else{
      var sql
      = 'insert into user ('
      + 'username,'
      + 'password,'
      + 'school'
      + ') values ('
      + '\'' + uname     + '\','
      + '\'' + password  + '\','
      + '\'' + school    + '\')';
      db.insert(sql)
      .then(function(result) {
        req.session.username  = uname;
        req.session.school    = school;
        res.send('success');
      });
    }
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
  db.select('select username,password,school from user where username = \'' + uname + '\'')
  .then(
    function(rows) {
      if(!rows.length){
        res.send('用户名不存在！');
      }else if(rows[0].password === password){
        req.session.username  = uname;
        req.session.school    = rows[0].school;
        res.send('success');
      }else{
        res.send('密码错误！');
      }
    }
  );
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
  var sql         = 'insert into goods('
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
  db.insert(sql)
  .then(function(result) {
    sql = '';
    var imgs = req.session.imgs;
    while(imgs.length){
      sql += 'insert into img(src, G_ID) values(' + '\'' + imgs.shift() + '\',' + result.insertId + ');';
    }
    console.log(req.session.imgs);
    db.insert(sql).then(function(result) {
      res.redirect('/');
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
    fs.rename(tempName, tarName, function(){
      if(!req.session.imgs){
        req.session.imgs = [];
      }
      req.session.imgs.push(tarName);
      res.send({imgUrl: tarName});
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
