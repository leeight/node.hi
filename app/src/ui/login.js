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
require(['../socket', '../friends'], function(socket, FRIENDS){
$(function(){
  var IS_CONNECTED = false;
  var tpl_contact = $("#TPL-contact").val();

  function on_relogin() {
    IS_CONNECTED = false;
    $(".contacts").hide("slow").html('<ul/>');
    $("form").show("slow");
  }

  function on_connect() {
    console.log("connect");
    IS_CONNECTED = true;
  }

  // 登陆成功, 展现联系人的界面
  function on_login_success() {
    $("form").hide("fadeIn");
    $(".contacts").show("fadeOut");
  }

  // 获取到联系人的信息, 展示联系人
  function on_friend_list(friends) {
    var html = [];
    friends.forEach(function(friend){
      FRIENDS.add(friend);
      html.push(Mustache.to_html(tpl_contact, friend));
    });
    $(".contacts ul").append(html.join(''));
    $(".contacts ul li.empty").remove();
  }

  // 展示过滤之后的结果.
  function display_filter_result(friends) {
    $(".contacts ul").empty();

    if (!friends || friends.length <= 0) {
      $(".contacts ul").append('<li class="empty">Not found any matched contact.</li>');
      return;
    }

    var html = [];
    friends.forEach(function(friend){
      html.push(Mustache.to_html(tpl_contact, friend));
    });
    $(".contacts ul").html(html.join(''));
  }

  // 获取到新的消息.
  function on_new_message(message) {
    console.log(message);
  }

  socket.on('connect', on_connect);
  socket.on('disconnect', on_relogin);
  socket.on('close', on_relogin);
  socket.on('login_success', on_login_success);
  socket.on('friend_list', on_friend_list);
  socket.on('new_message', on_new_message);

  // --- 页面UI事件绑定 ---
  $("button[type=submit]").click(function(){
    if (!IS_CONNECTED) {
      return false;
    }

    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    if (!username || !password) {
      return false;
    }

    socket.emit('login', {
      'username': username,
      'password': password
    });
    return false;
  });

  $(".contacts").on("click", "li", function(){
    console.log(this);
    return false;
  });

  $(".filter input").on('input', function(){
    var query = $(this).val().trim();
    if (query.length > 3) {
      display_filter_result(FRIENDS.search(query));
    } else if (query.length <= 0) {
      // 重新展示所有的好友
      $(".contacts ul").empty();
      on_friend_list(FRIENDS.getTopFriends());
    }
  });
});



















});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
