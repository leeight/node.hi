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
  this.on('_on_user_set', this._onUserSet.bind(this));
  this.on('_on_user_login_ready', this._onUserLoginReady.bind(this));
  this.on('_on_user_query', this._onUserQuery.bind(this));
  this.on('message', this.onMessage.bind(this));
}
base.inherits(Login, events.EventEmitter);

Login.prototype._onUserQuery = function(response, nm) {
  logger.debug('Login.prototype._onUserQuery');
  if (response.code === constant.StatusCode.SUCCESS) {
    nm.getClient().emit('user_query', response);
  }

  nm.getClient().setStatus(constant.LOGIN_READLY);
}

Login.prototype._onUserLoginReady = function(response, nm) {
  logger.debug('Login.prototype._onUserLoginReady');
  if (response.code !== constant.StatusCode.SUCCESS) {
    logger.error('login_ready status error.');
    nm.getClient().setStatus(constant.OFFLINE);
    return;
  }
}

Login.prototype._onUserSet = function(response, nm) {
  logger.debug('Login.prototype._onUserSet');
  switch(response.code) {
    case constant.StatusCode.SUCCESS: {
      logger.info('constant.StatusCode.SUCCESS');
      var cmd = nm.findCommand(response.seq);
      nm.getClient().getUser().user_status = cmd.status;
      nm.removeCommand(response.seq);
      break;
    }
    default: {
      logger.error('user_set failed, response.code = [' + response.code + ']');
      break;
    }
  }

  if (nm.getClient().getStatus() === constant.LOGIN_READLY) {
    return;
  }

  nm.getClient().setStatus(constant.LOGIN_READLY);
  nm.getClient().emit('login_ready');
}

Login.prototype._onLogin = function(response, nm) {
  logger.debug('Login.prototype._onLogin');
  switch(response.code) {
    case constant.StatusCode.SUCCESS: {
      var client = nm.getClient();
      client.getUser().imid = response.imid;
      client.emit('login_success');
      break;
    }
    case constant.StatusCode.PASSWORD_ERROR:
    case constant.StatusCode.PROTOCOL_ERROR: {
      logger.error('invalid password');
      // TODO 看情况刷新验证码
      break;
    }
    case constant.StatusCode.VCODE_ERROR: {
      logger.error('invalid verify code');
      // TODO 刷新验证码
      break;
    }
    case constant.StatusCode.VCODE_TIME_OUT: {
      logger.error('verify code timeout');
      break;
    }
    case constant.StatusCode.NO_USER_NAME: {
      logger.error('constant.StatusCode.NO_USER_NAME');
      break;
    }
    case constant.StatusCode.USERNAME_ALREADY_USED: {
      logger.error('constant.StatusCode.USERNAME_ALREADY_USED');
      break;
    }
    case constant.StatusCode.NO_USER: {
      logger.error('constant.StatusCode.NO_USER');
      break;
    }
    case constant.StatusCode.LOW_VERSION: {
      logger.error('constant.StatusCode.LOW_VERSION');
      break;
    }
    case constant.StatusCode.CANNT_LOGIN: {
      logger.error('constant.StatusCode.CANNT_LOGIN');
      break;
    }
    case constant.StatusCode.SERVER_ERROR: {
      logger.error('constant.StatusCode.SERVER_ERROR');
      break;
    }
    case constant.StatusCode.NOT_ACTIVATING: {
      logger.error('constant.StatusCode.NOT_ACTIVATING');
      break;
    }
    default: {
      break;
    }
  }
}

Login.prototype._onVerify = function(response, nm) {
  logger.debug('Login.prototype._onVerify');

  var seq = response.seq;
  var cmd = nm.findCommand(seq);
  if (!cmd || cmd.type != constant.VerifyCodeType.VerifyCodeLogin) {
    logger.error('mismatch response and command.');
    return;
  }

  switch(response.code) {
    case constant.StatusCode.NO_USER: {
      logger.error('no such user.');
      break;
    }
    case constant.StatusCode.PROTOCOL_ERROR: {
      logger.error('invalid password');
      break;
    }
    case constant.StatusCode.SUCCESS: {
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
          this.period, response.verify_code, nm.getClient().getUser()));
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
  logger.debug('Login.prototype.onMessage');
  logger.debug('cmd = [' + cmd + ']');
  logger.debug('protocolType = [' + protocolType + ']');

  switch(cmd) {
    case 'verify':
    case 'login':
    case 'kickout':
      this.emit('_on_' + cmd, response, nm);
      return;
  }

  switch(protocolType) {
    case 'user_set':
    case 'user_login_ready':
    case 'user_query':
    case 'query_offline_msg_count':
      this.emit('_on_' + protocolType, response, nm);
      return;
  }

  logger.error('invalid cmd = [' + cmd + '] or protocolType = [' + protocolType + ']');
}

exports.Login = Login;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
