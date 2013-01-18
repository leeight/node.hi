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
var command = require('./command');
var constant = require('./constant');
var lnet = require('./lnet');
var logger = require('./logger').getLogger(__filename);
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

  this.on('friend_list', this._onFriendList.bind(this));

  this.on('offline_msg_count', this._onOfflineMsgCount.bind(this));
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
 * @param {int} count 离线消息的数量.
 */
Client.prototype._onOfflineMsgCount = function(count) {
  if (count > 0) {
    // 普通消息
    this.nm.sendMessage(new command.OfflineMsgCommand(0, 0, "0", "0", this.user.imid));
    // 群消息
    // this.nm.sendMessage(new command.OfflineMsgCommand(1, 0, "0", "0", this.user.imid));
  }
}

/**
 * @param {Array.<model.Friend>} friends 好友列表.
 */
Client.prototype._onFriendList = function(friends) {
  friends.forEach(function(friend){
    logger.debug(base.toString(friend));
  });
  // model.Friend.save(friends);
}

/**
 * 给对方发送消息.
 * @param {int} to_id
 * @param {string} msg
 */
Client.prototype.sendMessage = function(to_id, msg) {
  var chat_info = new model.ChatInfo();
  chat_info.display_message = msg;
  chat_info.from_id = this.user.imid;
  chat_info.to_id = to_id;
  chat_info.type = 1;
  chat_info.wait_ack = 120;

  this.nm.sendMessage(new command.MsgRequestCommand(this.user.imid, chat_info));
}

/**
 * @param {response.MsgNotifyResponse} response 新的消息.
 */
Client.prototype._onNewMessage = function(response) {
  logger.debug('Client.prototype._onNewMessage');

  var text = utils.xml2text(response.xml);
  logger.info(text);
  // var text = '<msg><img t="gif" md5="c93970628d9a87d3207f366acd1427e6" /></msg>';

  // ECHO BACK
  var chat_info = new model.ChatInfo();
  // chat_info.thumbnail_url = 'data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg';
  chat_info.thumbnail_url = "data/images/thumb/logo.gif";
  // chat_info.thumbnail_url = 'data/images/thumb/2013-01-15 19.34.20.jpg';
  chat_info.display_image_type = constant.ImageType.CHAT_LARGE;
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
    base.mixin(this.user, user);
    logger.debug('user_query_response = [%s]', base.toString(this.user));
  }
  this.nm.sendMessage(new command.OfflineMsgCountCommand(0, 1, 0, this.user.imid));
  this.emit('after_user_query');
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
  // 获取好友列表
  this.nm.sendMessage(new command.FriendFetchCommand(this.user.imid));
  // 获取图片服务器
  this.nm.sendMessage(new command.ImageSrvCommand(this.user.imid));
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
  if (this.nm) {
    throw new Error("Can't call twice");
  }

  this.nm = new lnet.NetManager(this);
  this.nm.start();
}

if (!module.parent) {
  var prompt = require('prompt');
  var properties = [
    {name:'username'},
    {name:'password',hidden:true}
  ];
  prompt.start();
  prompt.get(properties, function (err, result) {
    if (err) {
      console.log(err);
      return 1;
    }

    var client = new Client();
    client.setUser(result.username, result.password);
    client.on('login_success', function(){
      logger.debug('client.user.imid = [' + this.user.imid + ']');
    });
    client.start();
  });
}


















exports.Client = Client;

/* vim: set ts=4 sw=4 sts=4 tw=100: */
