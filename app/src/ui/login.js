/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * assets/js/login.js ~ 2013/01/06 15:38:15
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
require(['../socket', '../friends'], function(socket, friends){

var is_connected = false;
var tpl_contact = $("#TPL-contact").val();
var channel = socket.get();
var chat_windows = {};

function on_relogin() {
  is_connected = false;
  $(".main").hide("slow").html('<ul/>');
  $("form").show("slow");
}

function on_connect() {
  console.log("connect");
  is_connected = true;
}

// 登陆成功, 展现联系人的界面
function on_login_success(msg) {
  console.log(msg);
  $("form").hide("fadeIn");
  $(".main").show("fadeOut");
}

// 获取到联系人的信息, 展示联系人
function on_friend_list(fs) {
  var html = [];
  fs.forEach(function(friend){
    friends.add(friend);
    html.push(Mustache.to_html(tpl_contact, friend));
  });
  $(".contacts ul").append(html.join(''));
  $(".contacts ul li.empty").remove();
}

// 展示过滤之后的结果.
function display_filter_result(fs) {
  $(".contacts ul").empty();

  if (!fs || fs.length <= 0) {
    $(".contacts ul").append('<li class="empty">Not found any matched contact.</li>');
    return;
  }

  var html = [];
  fs.forEach(function(friend){
    html.push(Mustache.to_html(tpl_contact, friend));
  });
  $(".contacts ul").html(html.join(''));
}

// 获取到新的消息.
function on_new_message(message) {
  var from_id = message.from_id;
  if (!chat_windows[from_id]) {
    chrome.app.window.create('chat.html?imid=' + from_id, {
      'width': 360,
      'height': 393,
    }, function(w){
      console.log(w);
      chat_windows[from_id] = w;
      w.contentWindow.postMessage({
        type: 'new_message',
        data: message
      }, "*");
    });
  } else {
    chat_windows[from_id].contentWindow.postMessage({
      type: 'new_message',
      data: message
    }, "*");
  }
  console.log(message);
}

channel.on('connect', on_connect);
channel.on('disconnect', on_relogin);
channel.on('close', on_relogin);
channel.on('login_success', on_login_success);
channel.on('friend_list', on_friend_list);
channel.on('new_message', on_new_message);

// --- 页面UI事件绑定 ---
$("button[type=submit]").click(function(){
  if (!is_connected) {
    return false;
  }

  var username = $("#username").val().trim();
  var password = $("#password").val().trim();

  if (!username || !password) {
    return false;
  }

  channel.emit('login', {
    'username': username,
    'password': password
  });
  return false;
});

$(".contacts").on("click", "li", function(){
  var imid = $(this).data("imid");
  chrome.app.window.create('chat.html?imid=' + imid, {
    'width': 360,
    'height': 393,
  });
  return false;
});

$(".filter input").on('input', function(){
  var query = $(this).val().trim();
  if (query.length > 3) {
    display_filter_result(friends.search(query));
  } else if (query.length <= 0) {
    // 重新展示所有的好友
    $(".contacts ul").empty();
    on_friend_list(friends.getTopFriends());
  }
});
















});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
