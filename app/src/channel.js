/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/channel.js ~ 2013/01/08 23:12:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 跨页面交互的一些方法，模拟socket.io的接口.
 * 对于子页面/父页面来说，只要使用:
 * channel.on('my_event', function(data){});
 * channel.on('my_event', function(data){});
 *
 * 父页面 -> 子页面
 * ui.createChatWindow(url, function(w){
 *   channel.emit(w, 'my_event', data);
 * });
 * 子页面 -> 父页面
 * channel.emit(window.opener, 'my_event', data);
 **/
define(function(){
  var handlers = {};

  /**
   * 监听自定义的事件.
   */
  function on(type, callback) {
    handlers[type] = callback;
  }

  function handleMessageEvent(e) {
    var payload = e.data;
    var type = payload.type;
    var data = payload.data;
    if (handlers[type]) {
      handlers[type].call(null, data);
    }
  }

  /**
   * @type {Window} w
   */
  function init(w) {
    w.addEventListener('message', handleMessageEvent, false);
  }

  /**
   * @type {Window} w The main or sub window’s reference.
   * @type {string} type The event type.
   * @type {Object} data The event data.
   */
  function emit(w, type, data) {
    if (w && !w.closed) {
      // 有时候sub window还没有初始化好, 发送的事件
      // 可能就别丢弃了
      w.postMessage({
        type: type,
        data: data
      }, "*");
    }
  }

  return {
    init: init,
    emit: emit,
    on: on
  };
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
