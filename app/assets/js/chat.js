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
  var LAST_FROM_ID = 0;

  function htmlEncode(value){ 
    if (value) {
      return jQuery('<div/>').text(value).html(); 
    } else {
      return '';
    }
  }

  var socket = io.connect('http://localhost:8888');
  socket.on('connect', function (){
    $(".threads").empty();
  });
  socket.on('new_message', function (message) {
    LAST_FROM_ID = message.from_id;
    if (!message.source_type) {
      message.source_type = 'incoming';
    }
    var last = $(".threads .message:last-child");
    if (last.hasClass(message.source_type)) {
      last.data('from-id', message.from_id);
      last.find('.content').append(tpl_bd(message));
    } else {
      $(".threads").append(tpl_new_message(message));
    }
  });

  $("#msg").on('input', function(){
    var rows = $(this).val().split(/\r?\n/g);
    $(this).css('height', Math.max(rows.length, 3) * 20);
  });

  $("button[type=\"submit\"]").click(function(){
    var msg = $("#msg").val().trim();
    if (msg) {
      if (LAST_FROM_ID) {
        socket.emit('send_message', {
          to_id: LAST_FROM_ID,
          text: msg
        });

        var message = {
          source_type: 'outcoming',
          content: htmlEncode(msg),
          time: new Date().toString()
        };
        var last = $(".threads .message:last-child");
        if (last.hasClass("outcoming")) {
          last.find('.content').append(tpl_bd(message));
        } else {
          $(".threads").append(tpl_new_message(message));
        }
      }
    }
    return false;
  });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
