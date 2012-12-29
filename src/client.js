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
var user = require('./user');
var base = require('./base');
var utils = require('./utils');
var events = require('events');

/**
 * @constructor
 */
function Client() {
  events.EventEmitter.call(this);

  /**
   * @type {User}
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

  this.on('finish_handshake', this._onFinishHandShake.bind(this));
  this.on('login_success', this._onLoginSuccess.bind(this));
  this.on('login_ready', this._onLoginReady.bind(this));
  this.on('user_query', this._onUserQuery.bind(this));
  this.on('new_message', this._onNewMessage.bind(this));
}
base.inherits(Client, events.EventEmitter);

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
 * @param {response.MsgNotifyResponse} response 新的消息.
 */
Client.prototype._onNewMessage = function(response) {
  logger.debug('Client.prototype._onNewMessage');

  var text = utils.xml2text(response.xml);
  logger.info(text);
}

/**
 * @param {response.UserQueryReponse} response 服务器返回的结果.
 */
Client.prototype._onUserQuery = function(response) {
  var user = response.getUser();
  if (user) {
    for (var key in user) {
      if (user.hasOwnProperty(key)) {
        this.user[key] = user[key];
        logger.info('user.' + key + ' = [' + user[key] + ']');
      }
    }
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

  this.socket = net.createConnection(1863, "m1.im.baidu.com");
  this.nm = new lnet.NetManager(this.socket, this);

  this.socket.on('connect', function (connect) {
    logger.debug('connection established');
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

var client = new Client();
client.user = new user.User('linuxracer', 'zhenxi');
client.on('login_success', function(){
  logger.debug('client.user.imid = [' + this.user.imid + ']');
});
client.start();




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
