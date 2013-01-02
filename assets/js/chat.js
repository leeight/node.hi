/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * assets/js/chat.js ~ 2012/12/30 21:01:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
$(function(){
  var tpl_new_message = jade.compile($("#TPL-new-message").val())
  var tpl_bd = jade.compile($("#TPL-message-bd").val());

  var socket = io.connect('http://localhost:8888');
  socket.on('new_message', function (message) {
    if (!message.source_type) {
      message.source_type = 'incoming';
    }
    var last = $(".threads .message:last-child");
    if (last.hasClass(message.source_type)) {
      last.find('.content').append(tpl_bd(message));
    } else {
      $(".threads").append(tpl_new_message(message));
    }
    window.scrollTo(0, 100000);
  });

  $(".sent textarea").on('input', function(){
    var rows = $(this).val().split(/\r?\n/g);
    $(this).css('height', Math.max(rows.length, 3) * 16);
  });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
