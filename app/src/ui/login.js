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
require(['../socket', '../friends', '../debug', './ui', '../channel'], function(socket, friends, debug, ui, channel){

var is_connected = false;
var tpl_contact = $("#TPL-contact").val();
var tpl_me = $("#TPL-me").val();
var serverChannel = socket.get();
var clientChannel = channel;
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
  var url = 'chat.html?imid=' + from_id;
  ui.createChatWindow(url, function(w){
    w.postMessage({
      type: 'new_message',
      data: message
    }, "*");
  });
}

// 获取到当前登录人的信息
function on_after_user_query(user) {
  $(".main .header").html(Mustache.to_html(tpl_me, user));
}

// Server Channel Events
serverChannel.on('connect', on_connect);
serverChannel.on('disconnect', on_relogin);
serverChannel.on('close', on_relogin);
serverChannel.on('login_success', on_login_success);
serverChannel.on('friend_list', on_friend_list);
serverChannel.on('new_message', on_new_message);
serverChannel.on('after_user_query', on_after_user_query);

// Client Channel Events
clientChannel.init(window);
clientChannel.on('after_init', function(data){
  var window_id = data.window_id;
  var imid = data.imid;
  clientChannel.emit(ui.findChatWindow(window_id), 'after_user_query', friends.find(imid));
});
clientChannel.on('send_message', function(data){
  console.log(data);
});

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

  serverChannel.emit('login', {
    'username': username,
    'password': password
  });
  return false;
});

$(".contacts").on("click", "li", function(){
  var imid = $(this).data("imid");
  var url = 'chat.html?imid=' + imid;
  ui.createChatWindow(url);
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


if (debug.isEnable()) {
  on_login_success('OK');
  on_after_user_query(debug.getDefaultUser());
  on_friend_list(debug.getDefaultFriendList());
}
















});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
