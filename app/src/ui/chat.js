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
require(['../channel', '../debug'], function(channel, debug){

var tpl_new_message = $("#TPL-new-message").val();
var tpl_bd = $("#TPL-message-bd").val();
var tpl_me = $("#TPL-me").val();
var last_from_id = document.location.search.replace(/\?imid=/, '');
var window_id = (location.pathname + location.search).substr(1);
var friend;   // 好友的信息
var mine;     // 我的信息

function htmlEncode(value){ 
  if (value) {
    return jQuery('<div/>').text(value).html(); 
  } else {
    return '';
  }
}

// --- Server Events Handlers
function on_connect() {
  $(".threads").empty();
}

function on_new_message(message) {
  debugger;
  last_from_id = message.from_id;
  if (!message.source_type) {
    message.source_type = 'incoming';
  }
  message.avatar = mine.avatar;
  var last = $(".threads .message:last-child");
  if (last.hasClass(message.source_type)) {
    last.data('from-id', message.from_id);
    last.find('.content').append(Mustache.to_html(tpl_bd, message));
  } else {
    $(".threads").append(Mustache.to_html(tpl_new_message, message));
  }
}

function on_after_user_query(data) {
  $(".header").html(Mustache.to_html(tpl_me, data.friend));
  friend = data.friend;
  mine = data.mine;
  document.title = 'Chat with ' + friend.baiduid;
}

function on_ping_ack(data) {
  // Client Channel Is Ready.
  // --- Notify Parent Window ----
  channel.emit(window.opener, 'after_init', {
    window_id: window_id,
    imid: last_from_id
  });
}

// --- Server Events ---
channel.init(window);
channel.on('connect', on_connect);
channel.on('new_message', on_new_message);
channel.on('after_user_query', on_after_user_query);
channel.on('ping_ack', on_ping_ack);

// TODO(leeight) 接口不友好.
channel.ping(window.opener, {window_id: window_id});

// --- UI Events ---
$("#msg").on('keypress', function(e){
  if (e.charCode === 13 && e.ctrlKey) {
    var msg = $(this).val().trim();
    if (msg) {
      if (last_from_id) {
        if (channel && channel.emit) {
          channel.emit(window.opener, 'send_message', {
            to_id: last_from_id,
            text: msg
          });
        }

        var source_type = 'outcoming';
        var message = {
          avatar: friend.avatar,
          source_type: source_type,
          content: htmlEncode(msg),
          time: new Date().toString()
        };
        var last = $(".threads .message:last-child");
        if (last.hasClass(source_type)) {
          last.find('.content').append(Mustache.to_html(tpl_bd, message));
        } else {
          $(".threads").append(Mustache.to_html(tpl_new_message, message));
        }
      }

      $(this).val('');
      return false;
    }
  }
});



if (debug.isEnable()) {
  channel.emit(window, 'new_message', debug.getIncomingMesage());
}
















});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
