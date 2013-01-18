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
 **/
define(function(){
  var handlers = {};
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
   * @type {Window} main
   * @type {Window} sub
   */
  function connect(main, sub) {
    sub.addEventListener('message', handleMessageEvent, false);
    main.addEventListener('message', handleMessageEvent, false);
  }

  function emit(type, data) {
    window.opener.postMessage({
      type: type,
      data: data
    }, "*");
  }

  return {
    connect: connect,
    emit: emit,
    on: on
  };
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
