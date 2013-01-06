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
$(function(){
  var IS_CONNECTED = false;
  var tpl_contact = $("#TPL-contact").val();

  function relogin() {
    IS_CONNECTED = false;
    $(".contacts").hide("slow").html('<ul/>');
    $("form").show("slow");
  }

  var socket = io.connect('http://localhost:8888');
  socket.on('connect', function (){
    console.log("connect");
    IS_CONNECTED = true;
  });

  socket.on('disconnect', relogin);
  socket.on('close', relogin);

  socket.on('login_success', function(message){
    // 登陆成功, 展现联系人的界面
    $("form").hide("slow");
    $(".contacts").show("slow");
  });

  // 获取到联系人的信息, 展示联系人
  socket.on('friend_list', function(friends){
    friends.forEach(function(friend){
      $(".contacts ul").append(Mustache.to_html(tpl_contact, friend));
    });
  });

  socket.on('new_message', function (message) {
    console.log(message);
  });

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
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
