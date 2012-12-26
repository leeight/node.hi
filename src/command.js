/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * command.js ~ 2012/12/26 21:09:40
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

var base = require('./base');
var lnet = require('./lnet');
var constant = require('./constant');
var security = require('./security');
var logger = require('./logger').logger;

/**
 * @param {string} superCommand
 * @param {string} command
 * @param {string} version
 */
function BaseCommand(superCommand, command, version) {
  /**
   * @type {string}
   */
  this.superCommand = superCommand;

  /**
   * @type {string}
   */
  this.command = command;

  /**
   * @type {string}
   */
  this.version = version;

  /**
   * @type {string}
   */
  this.protocolType = superCommand.trim().toUpperCase() +
                      "_" + command.trim().toUpperCase();

  /**
   * @type {int}
   */
  this.seq;

  /**
   * @type {string}
   */
  this.contentType = BaseCommand.CONTENT_TYPE_TEXT;

  /**
   * @type {Object.<string, string>}
   */
  this.commandHead = {};

  /**
   * @type {string}
   */
  this.commandBody;
}
BaseCommand.SPACE = ' ';
BaseCommand.CHANGE_LINE = '\n';
BaseCommand.SEPARATED = '\r\n';
BaseCommand.SEMICOLON = ':';
BaseCommand.MESTHOD_KEY = 'method:';
BaseCommand.CONTENT_LENGTH_KEY = 'content-length';
BaseCommand.CONTENT_TYPE_KEY = 'content-type';
BaseCommand.REQUEST = 'R';
BaseCommand.CONTENT_TYPE_TEXT = 'text';

/**
 * @param {string} key
 * @param {string} value
 */
BaseCommand.prototype.addCommandHead = function(key, value) {
  this.commandHead[key] = value;
}

/**
 * @return {string}
 */
BaseCommand.prototype.createCommand = function() {
  this.commandBody = this.createCommandBody();
  this.seq = lnet.NetManager.getNextId();

  var buffer = [];
  buffer.push(this.superCommand);
  buffer.push(BaseCommand.SPACE);
  buffer.push(this.version);
  buffer.push(BaseCommand.SPACE);
  buffer.push(BaseCommand.REQUEST);
  buffer.push(BaseCommand.SPACE);
  buffer.push(this.seq);
  buffer.push(BaseCommand.CHANGE_LINE);
  if (this.command) {
    buffer.push(BaseCommand.MESTHOD_KEY);
    buffer.push(this.command);
    buffer.push(BaseCommand.CHANGE_LINE);
  }
  if (this.commandBody) {
    buffer.push(BaseCommand.CONTENT_LENGTH_KEY);
    buffer.push(BaseCommand.SEMICOLON);
    buffer.push(Buffer.byteLength(this.commandBody));
    buffer.push(BaseCommand.CHANGE_LINE);

    buffer.push(BaseCommand.CONTENT_TYPE_KEY);
    buffer.push(BaseCommand.SEMICOLON);
    buffer.push(this.contentType);
    buffer.push(BaseCommand.CHANGE_LINE);
  }

  for(var key in this.commandHead) {
    if (this.commandHead.hasOwnProperty(key)) {
      buffer.push(key);
      buffer.push(BaseCommand.SEMICOLON);
      buffer.push(this.commandHead[key]);
      buffer.push(BaseCommand.CHANGE_LINE);
    }
  }

  buffer.push(BaseCommand.SEPARATED);

  if (this.commandBody) {
    buffer.push(this.commandBody);
  }

  return buffer.join('');
}

/**
 * @return {string}
 */
BaseCommand.prototype.createCommandBody = function() {
  throw new Error("unimplemented");
}

/**
 * @param {int} type constant.VerifyCodeType
 * @param {int} uid
 * @param {string} lid
 * @param {int} friend
 * @param {int} uid2
 * @extends {BaseCommand}
 */
function VerifyCommand(type, uid, lid, friend, uid2) {
  BaseCommand.call(this, "security", "verify", "1.0");

  /**
   * @type {int}
   */
  this.uid = uid;

  /**
   * @type {string}
   */
  this.lid = lid;

  /**
   * @type {int}
   */
  this.friend = friend;

  /**
   * @type {int}
   */
  this.uid2 = uid2;

  /**
   * @type {int}
   */
  this.type = type;

  this.addCommandHead("uid2", String(uid2));

  this._setCommandHead();
}
base.inherits(VerifyCommand, BaseCommand);

/**
 * @private
 */
VerifyCommand.prototype._setCommandHead = function() {
  this.addCommandHead("uid", String(this.uid));
  this.addCommandHead("lid", this.lid);
  switch (this.type) {
    case constant.VerifyCodeType.VerifyCodeLogin:
      break;
    case constant.VerifyCodeType.VerifyCodeAddFriend:
      this.addCommandHead("friend", String(this.friend));
      break;
    default:
      break;
  }
  this.addCommandHead("type", String(this.type));
}

VerifyCommand.prototype.createCommandBody = function() {
  return null;
}

// var vc = new VerifyCommand(1, 100, 'leeight', 89, 64);
// logger.debug(vc);
// logger.debug(JSON.stringify(vc.createCommand()));


/**
 * @param {string} url
 * @param {string} time
 * @param {string} period
 * @param {string} code
 * @param {User} user
 */
function LoginCommand(url, time, period, code, user) {
  BaseCommand.call(this, "login", "login", "4.2");

  /**
   * @private
   * @type {string}
   */
  this.url = url;

  /**
   * @private
   * @type {string}
   */
  this.time = time;

  /**
   * @private
   * @type {string}
   */
  this.period = period;

  /**
   * @private
   * @type {string}
   */
  this.code = code;

  /**
   * @private
   * @type {User}
   */
  this.user = user;

  this._setCommandHead();
}
base.inherits(LoginCommand, BaseCommand);

/**
 * @private
 */
LoginCommand.prototype._setCommandHead = function() {
  this.addCommandHead("v_url", this.url);
  this.addCommandHead("v_time", this.time);
  this.addCommandHead("v_period", this.period);
  this.addCommandHead("v_code", this.code);
  this.addCommandHead("priority", String(this.user.priority));
}

/**
 * <login><user account="leeight" password="password" imversion="1,2,3,4" redirect_times="0" priority="20" platform="android" client_type="4" new_username="user.new_username" /></login>
 * @return {string}
 */
LoginCommand.prototype.createCommandBody = function() {
  var buffer = ['<login>'];
  buffer.push('<user');
  if (this.user.account) {
    buffer.push(' account="' + this.user.account + '"');
  }
  if (this.user.password) {
    buffer.push(' password="' + security.encryptPassword(this.user.password) + '"');
  }
  buffer.push(' imversion="' + this.user.imversion + '"');
  buffer.push(' redirect_times="' + this.user.redirect_times + '"');
  buffer.push(' priority="' + this.user.priority + '"');
  buffer.push(' platform="' + this.user.platform + '"');
  buffer.push(' client_type="' + this.user.client_type + '"');
  if (this.user.new_username) {
    buffer.push(' new_username="' + this.user.new_username + '"');
  }
  buffer.push(' />');
  buffer.push('</login>');

  return buffer.join('');
}

/*
var lc = new LoginCommand('url', 'time', 'period', 'code', {
  priority: 8964,
  account: 'leeight',
  password: 'password',
  imversion: '1,2,3,4',
  redirect_times: '0',
  platform: 'android',
  client_type: 4,
  new_username: 'new_username'
});
logger.debug(lc.createCommand());
*/
















exports.BaseCommand = BaseCommand;
exports.LoginCommand = LoginCommand;
exports.VerifyCommand = VerifyCommand;


/* vim: set ts=4 sw=4 sts=4 tw=100: */
