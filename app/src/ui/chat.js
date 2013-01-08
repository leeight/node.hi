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
require(['../channel'], function(channel){

var tpl_new_message = $("#TPL-new-message").val();
var tpl_bd = $("#TPL-message-bd").val();
var last_from_id = document.location.search.replace(/\?imid=/, '');

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
  last_from_id = message.from_id;
  if (!message.source_type) {
    message.source_type = 'incoming';
  }
  var last = $(".threads .message:last-child");
  if (last.hasClass(message.source_type)) {
    last.data('from-id', message.from_id);
    last.find('.content').append(Mustache.to_html(tpl_bd, message));
  } else {
    $(".threads").append(Mustache.to_html(tpl_new_message, message));
  }
}

// --- Server Events ---
channel.on('connect', on_connect);
channel.on('new_message', on_new_message);

// --- UI Events ---
$("#msg").on('keypress', function(e){
  if (e.charCode === 13 && e.ctrlKey) {
    var msg = $(this).val().trim();
    if (msg) {
      if (last_from_id) {
        channel.emit('send_message', {
          to_id: last_from_id,
          text: msg
        });

        var message = {
          source_type: 'outcoming',
          content: htmlEncode(msg),
          time: new Date().toString()
        };
        var last = $(".threads .message:last-child");
        if (last.hasClass("outcoming")) {
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



















});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
