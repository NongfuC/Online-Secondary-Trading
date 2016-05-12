$('.reg-btn').click(function() {
  var uname       = $('#uname').val().trim();
  var password    = $('#password').val().trim();
  var rq_password = $('#qr_password').val().trim();
  var school      = $('#school').val().trim();
  if (!uname) {
    alert('用户名为空！');
    return;
  }
  if (uname.length < 4) {
    alert('用户名长度小于4个字符！');
    return;
  }
  if (!uname.match(/^[a-zA-Z]+\w+$/)) {
    alert('用户名只能由字母、下划线、数字组成，开头必须是字母');
    return;
  }
  if (!password) {
    alert('密码为空！');
    return;
  }
  if (password !== rq_password) {
    alert('两次输入的密码不一致');
    return;
  }
  if(!school){
    alert('请输入学校全称！');
  }
  $.post(
    'doreg'
  , {
      uname   : uname,
      password: password,
      school  : school
    }
  , function(data) {
      if (data.trim() === 'success') {
        location.href = '/';
      } else {
        alert(data);
      }
    }
  );
});

$('.login-btn').click(function() {
  var uname    = $('#uname').val().trim();
  var password = $('#password').val().trim();
  if (!uname) {
    alert('用户名为空！');
    return;
  }
  if (uname.length < 4) {
    alert('用户名长度小于4个字符！');
    return;
  }
  if (!uname.match(/^[a-zA-Z]+\w+$/)) {
    alert('用户名只能由字母、下划线、数字组成，开头必须是字母');
    return;
  }
  if (!password) {
    alert('密码为空！');
    return;
  }
  $.post(
    'dologin'
  , {
      uname: uname,
      password: password
    }
  , function(data) {
      if (data.trim() === 'success') {
        location.href = '/';
      } else {
        alert(data);
      }
    }
  );
});


/**
 *发布物品
 */
$('.goods input[type=radio],.goods input[type=text],.goods textarea,.goods select').blur(function() {
  if (!$(this).val()) {
    $(this).parent().parent().addClass('has-error');
  } else {
    $(this).parent().parent().removeClass('has-error').addClass('has-success');
  }
});

$('.goods').submit(function() {
  var sig = true;
  if (!$('.goods input').val()) {
    $('.goods input').parent().parent().addClass('has-error');
    sig = false;
  }
  if (!$('.goods textarea').val()) {
    $('.goods textarea').parent().parent().addClass('has-error');
    sig = false;
  }
  if (!$('.goods select').val()) {
    $('.goods select').parent().parent().addClass('has-error');
    sig = false;
  }
  return sig;
});

$('.goods input[type=radio]').click(function() {
  if ($(this).val() === '以物换物') {
    $('.js-qd-goods').show();
    $('.js-qd-price').hide();
  } else if ($(this).val() === '二手出售') {
    $('.js-qd-goods').hide();
    $('.js-qd-price').show();
  }
});

$('.js-add-img').click(function() {
  if ($('input[type=file]').length >= 12) {
    alert('图片最多12张');
    return;
  }
  var file = '<input class="form-control" type="file" name="img'
   + $('input[type=file]').length + '" multiple="multiple">';
  $(file).insertAfter('input[type=file]:last-of-type');
});

$('input[type=file]').blur(function() {
  if ($(this).val()) {
    var $this = $(this);
    var $form = $('<form enctype="multipart/form-data" method="post"></form>');
    var $file = $('<input type="file" name="img" multiple="multiple">');
    $file[0].files = this.files;
    $form.append($($file));
    var form = new FormData($form[0]);
    $.post({
      url: "/uploadImg",
      data: form,
      processData: false, // 告诉jQuery不要去处理发送的数据
      contentType: false // 告诉jQuery不要去设置Content-Type请求头
    }, function(data) {
      if (typeof data !== 'object') {
        alert(data);
      } else {
        $('<div class="col-xs-6 col-md-3"><a href="javacript:void(0)" class="thumbnail"><img src="' 
          + data.imgUrl + '"><span class="deleteImg" img="' + data.imgUrl 
          + '">删除</span></a></div>').insertBefore($this);
        deleteImg();
        $this.val('');
      }
    });
  }
});

function deleteImg() {
  $('.deleteImg').last().click(function() {
    var $this = $(this);
    var img = $this.attr('img');
    $.post('/delete', {
      img: img
    }, function(data) {
      if (data === 'success') {
        $this.parent().parent().remove();
      }
    });
  });
}

/**
 * 菜单碰到浏览器顶部悬浮
 */
function levitation(){
  var $menu = $('.js-menu');
  var top = $menu.offset().top;
  var levitation = false;
  $(window).scroll(function() {
    if ($(window).scrollTop() > top && levitation === false) {
      $menu.css({position: 'fixed', top: '10px', width: width = $menu.width()});
      levitation = true;
    }
    if ($(window).scrollTop() <= top && levitation === true) {
      $menu.css({position: '', width: ''});
      levitation = false;
    }
  });
}

if($(window).width() >= 992){
  levitation();
}