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
  var ChannelPool = {
    _channels: {},
    _prefix: Math.floor(Math.random() * 2147483648).toString(36),
    _uniqId: 0,
    getNextId: function() {
      return this._prefix + ':' + (this._uniqId ++);
    },
    get: function(id) {
      return this._channels[id];
    },
    getByUrl: function(peerUrl) {
      for(var key in this._channels) {
        var channel = this._channels[key];
        var peerWindow = channel.getPeerWindow();
        if (peerWindow && !peerWindow.closed) {
          if (peerWindow.location.href === peerUrl) {
            return channel;
          }
        }
      }
    },
    add: function(channel, opt_id) {
      var id = opt_id || channel.getId();
      if (!this._channels[id]) {
        this._channels[id] = channel;
      }
    },
    remove: function(channel) {
      delete this._channels[channel.getId()];
    }
  };

  /**
   * 主页面可以打开多个聊天窗口，因此在主页面存在多个ClientChannel的实例.
   * 我们需要存在一个统一分发postMessage事件的地方.
   */
  window.addEventListener('message', function(e){
    var payload = e.data;

    var type = payload.type;
    var data = payload.data;
    var peerChannelId = data['__peer_id__'];
    var peerUrl = data['__peer_url__'];

    var channel = (type === 'ping') ? ChannelPool.getByUrl(peerUrl) : 
      ChannelPool.get(peerChannelId);
    if (channel) {
      channel.handleEvent(type, data);
      ChannelPool.add(channel, peerChannelId);
    } else {
      throw new Error("Can\'t find client channel by id = [" + peerChannelId + "]");
    }
  }, false);

  /**
   * @type {Window} peerWindow
   */
  function ClientChannel(peerWindow) {
    this._peerWindow = peerWindow;
    this._handlers = {};
    this._id = ChannelPool.getNextId();
    this._peerId = '';
    ChannelPool.add(this);
  }

  /**
   * @param {string} peerId
   */
  ClientChannel.prototype.setPeerId = function(peerId) {
    this._peerId = peerId;
  }

  /**
   * @return {string}
   */
  ClientChannel.prototype.getId = function() {
    return this._id;
  }

  /**
   * @return {Window}
   */
  ClientChannel.prototype.getPeerWindow = function() {
    return this._peerWindow;
  }

  /**
   * @param {string} type
   * @param {*} data
   */
  ClientChannel.prototype.handleEvent = function(type, data) {
    if (this._handlers[type]) {
      this._handlers[type].call(null, data);
    }
  }

  ClientChannel.prototype.on = function(type, callback) {
    this._handlers[type] = callback;
  }

  /**
   * @param {string} type
   * @param {*=} opt_data
   */
  ClientChannel.prototype.emit = function(type, opt_data) {
    if (this._peerWindow && !this._peerWindow.closed) {
      var data = opt_data || {};
      data['__peer_id__'] = this._id;
      data['__peer_url__'] = window.location.href;
      this._peerWindow.postMessage({
        type: type,
        data: data
      }, "*");
    }
  }

  ClientChannel.prototype.ping = function() {
    this.emit('ping');
  }

  ClientChannel.prototype.close = function() {
    ChannelPool.remove(this);
  }

  return {
    ClientChannel: ClientChannel
  };
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
