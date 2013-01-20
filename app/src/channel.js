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
  var isReady = false;
  var peerIsReady = false;

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
    isReady = true;
  }

  function channelIsReady() {
    return isReady && peerIsReady;
  }

  function setPeerReady() {
    peerIsReady = true;
  }

  /**
   * @type {Window} w The main or sub window’s reference.
   * @type {string} type The event type.
   * @type {Object} data The event data.
   */
  function emit(w, type, data) {
    if (!channelIsReady()) {
      throw new Error("Client Channel is not ready");
    }

    if (w && !w.closed) {
      // 有时候sub window还没有初始化好, 发送的事件
      // 可能就别丢弃了
      w.postMessage({
        type: type,
        data: data
      }, "*");
    }
  }

  function ping(w, data) {
    if (w && !w.closed) {
      w.postMessage({
        type: 'ping',
        data: data
      }, "*");
    }
  }

  /**
   * @type {Window} peerWindow
   */
  function ClientChannel(peerWindow) {
    this._peerWindow = peerWindow;
    this._handlers = {};
    window.addEventListener('message', this._handleMessageEvent.bind(this), false);
  }

  ClientChannel.prototype._handleMessageEvent = function(e) {
    var payload = e.data;
    var type = payload.type;
    var data = payload.data;
    if (this._handlers[type]) {
      this._handlers[type].call(null, data);
    }
  }

  ClientChannel.prototype.on = function(type, callback) {
    this._handlers[type] = callback;
  }

  /**
   * @param {string} type
   * @param {*} data
   */
  ClientChannel.prototype.emit = function(type, data) {
    if (this._peerWindow && !this._peerWindow.closed) {
      this._peerWindow.postMessage({
        type: type,
        data: data
      }, "*");
    }
  }

  ClientChannel.prototype.ping = function() {
    this.emit('ping');
  }

  return {
    init: init,
    ping: ping,
    setPeerReady: setPeerReady,
    emit: emit,
    on: on,
    ClientChannel: ClientChannel
  };
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
