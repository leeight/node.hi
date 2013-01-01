/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * client.js ~ 2012/12/23 11:58:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var net = require('net')
var command = require('./command');
var constant = require('./constant');
var lnet = require('./lnet');
var logger = require('./logger').logger;
var model = require('./model');
var base = require('./base');
var utils = require('./utils');
var events = require('events');

/**
 * @constructor
 */
function Client() {
  events.EventEmitter.call(this);

  /**
   * @type {model.User}
   */
  this.user;

  /**
   * @type {lnet.NetManager}
   */
  this.nm;

  /**
   * @type {Socket}
   */
  this.socket;

  /**
   * @type {int}
   */
  this.status;

  // 四次握手结束
  this.on('finish_handshake', this._onFinishHandShake.bind(this));

  // ??
  this.on('login_success', this._onLoginSuccess.bind(this));

  // ??
  this.on('login_ready', this._onLoginReady.bind(this));

  // ??
  this.on('user_query', this._onUserQuery.bind(this));

  // 收到一条消息(好友 | 群 | 临时群)
  this.on('new_message', this._onNewMessage.bind(this));

  // 收到从服务器返回的好友列表(只有imid和其它简单的信息)
  this.on('friend_list', this._onFriendList.bind(this));
}
base.inherits(Client, events.EventEmitter);

Client.prototype.setUser = function(username, password) {
  this.user = new model.User(username, password);
}

Client.prototype.getUser = function() {
  return this.user;
}

Client.prototype.getStatus = function() {
  return this.status;
}

Client.prototype.setStatus = function(status) {
  this.status = status;
}

/**
 * @param {Array.<model.Friend>} friends 好友列表.
 */
Client.prototype._onFriendList = function(friends) {
  friends.forEach(function(friend){
    logger.debug(base.toString(friend));
  });
}

/**
 * @param {response.MsgNotifyResponse} response 新的消息.
 */
Client.prototype._onNewMessage = function(response) {
  logger.debug('Client.prototype._onNewMessage');

  var text = utils.xml2text(response.xml);
  logger.info(text);

  // ECHO BACK
  var chat_info = new model.ChatInfo();
  chat_info.display_message = text;
  chat_info.from_id = this.user.imid;
  chat_info.to_id = response.from_id;
  chat_info.type = 1;
  chat_info.wait_ack = 120;

  this.nm.sendMessage(new command.MsgRequestCommand(this.user.imid, chat_info));
}

/**
 * @param {response.UserQueryReponse} response 服务器返回的结果.
 */
Client.prototype._onUserQuery = function(response) {
  var user = response.getUser();
  if (user) {
    logger.debug(base.toString(user));
  }
}

/**
 * finish_handshake
 *   -> login_success
 *        -> login_ready
 */
Client.prototype._onLoginReady = function() {
  // 通知其它客户端掉线
  this.nm.sendMessage(new command.LoginReadyCommand(this.user));
  // 查询用户的信息
  this.nm.sendMessage(new command.UserQueryCommand(this.user));
  // XXX
  this.nm.sendMessage(new command.FriendFetchCommand(this.user.imid));
}

/**
 * 登陆成功了, 可以设置状态了.
 */
Client.prototype._onLoginSuccess = function() {
  var msg = new command.UserSetStatus(constant.USER_STATUS_ONLINE,
    '你好, 我在线, 哈哈', this.user.imid);
  this.nm.sendMessage(msg);
}

/**
 * 网路层握手成功, 可以尝试登陆了.
 */
Client.prototype._onFinishHandShake = function() {
  var msg = new command.VerifyCommand(constant.VerifyCodeType.VerifyCodeLogin,
    0, this.user.account, 0, 0);
  this.nm.sendMessage(msg);
}

Client.prototype.start = function() {
  var me = this;

  // m1 ~ m16
  var server = 'm' + (parseInt(Math.random() * 16, 10) + 1) + '.im.baidu.com';
  this.socket = net.createConnection(1863, server);
  this.nm = new lnet.NetManager(this.socket, this);

  this.socket.on('connect', function (connect) {
    logger.debug('connection established with [' + server + ']');
    me.nm.startHandshake();
  });
  this.socket.on('error', function (error) {
    logger.error(error);
  });
  this.socket.on('end', function () {
    logger.debug('socket closing...');
  });
  this.socket.setKeepAlive(true, 1000);
}

if (!module.parent) {
  var client = new Client();
  client.setUser('linuxracer', 'zhenxi');
  client.on('login_success', function(){
    logger.debug('client.user.imid = [' + this.user.imid + ']');
  });
  client.start();
}


















exports.Client = Client;

/* vim: set ts=4 sw=4 sts=4 tw=100: */
