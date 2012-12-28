/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * logic/login.js ~ 2012/12/28 22:12:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 登陆相关的业务处理
 **/
var events = require('events');
var base = require('../base');
var constant = require('../constant');
var command = require('../command');
var user = require('../user');
var logger = require('../logger').logger;

/**
 * @extends {events.EventEmitter}
 */
function Login() {
  events.EventEmitter.call(this);

  /**
   * @type {string}
   */
  this.url;

  /**
   * @type {string}
   */
  this.time;

  /**
   * @type {string}
   */
  this.period;

  this.on('_on_verify', this._onVerify.bind(this));
  this.on('_on_login', this._onLogin.bind(this));
  this.on('message', this.onMessage.bind(this));
}
base.inherits(Login, events.EventEmitter);

Login.prototype._onLogin = function(response, nm) {
  logger.debug('Login.prototype._onLogin');
  // TODO
}

Login.prototype._onVerify = function(response, nm) {
  logger.debug('Login.prototype._onVerify');
  logger.debug(response);

  var seq = response.seq;
  var cmd = nm.findCommand(seq);
  if (!cmd || cmd.type != constant.VerifyCodeType.VerifyCodeLogin) {
    logger.error('mismatch response and command.');
    return;
  }

  switch(response.code) {
    case constant.StausCode.NO_USER: {
      logger.error('no such user.');
      break;
    }
    case constant.StausCode.PROTOCOL_ERROR: {
      logger.error('invalid password');
      break;
    }
    case constant.StausCode.SUCCESS: {
      logger.debug('verify command passed');
      nm.removeCommand(seq);

      this.period = response.period;
      this.time = response.time;
      this.url = response.url;

      if (!response.verify_code) {
        logger.warn('please type the vcode');
        // FIXME(leeight) 验证码为空, 那么需要用户手工输入验证码.
      } else {
        // 直接返回验证码了, 不需要用户输入, 直接登陆
        nm.sendMessage(new command.LoginCommand(this.url, this.time,
          this.period, response.verify_code, user.User.getInstance()));
      }
    }
  }
}

/**
 * @param {BaseResponse} response
 * @param {NetManager} nm
 */
Login.prototype.onMessage = function(response, nm) {
  var cmd = response.command;
  var protocolType = (response.superCommand + '_' + cmd).toLowerCase();

  switch(cmd) {
    case 'verify':
    case 'login':
    case 'kickout':
      this.emit('_on_' + cmd, response, nm);
      break;
  }

  switch(protocolType) {
    case 'user_set':
    case 'user_login_ready':
    case 'user_query':
    case 'query_offline_msg_count':
      this.emit('_on_' + protocolType, response, nm);
      break;
  }
}

exports.Login = Login;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
