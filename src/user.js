/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * user.js ~ 2012/12/28 22:48:40
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base = require('./base');

/**
 * @constructor
 * @param {string=} opt_account
 * @param {string=} opt_password
 */
function User(opt_account, opt_password) {
  /**
   * @type {string}
   */
  this.imversion = "1,0,0,0";

  /**
   * @type {int}
   */
  this.priority = 20;

  /**
   * @type {int}
   */
  this.client_type = 4;

  /**
   * @type {string}
   */
  this.platform = "android";

  /**
   * @type {string}
   */
  this.redirect_times = "0";

  /**
   * @type {string}
   */
  this.account = opt_account;

  /**
   * @type {string}
   */
  this.password = opt_password;

  /**
   * @type {int}
   */
  this.user_status = 1;

  /**
   * @type {string}
   */
  this.new_username;

  /**
   * @type {bool}
   */
  this.is_remember_password;

  /**
   * @type {bool}
   */
  this.is_hide;

  /**
   * @type {string}
   */
  this.v_code;

  /**
   * @type {int}
   */
  this.imid;

  /**
   * @type {string}
   */
  this.name;

  /**
   * @type {string}
   */
  this.nickname;

  /**
   * @type {string}
   */
  this.personal_comment;

  /**
   * @type {int}
   */
  this.sex;

  /**
   * @type {string}
   */
  this.birthday;

  /**
   * @type {string}
   */
  this.phone;

  /**
   * @type {string}
   */
  this.email;

  /**
   * @type {string}
   */
  this.avatar;

  /**
   * @type {long}
   */
  this.last_login_time;

  /**
   * @type {int}
   */
  this.is_login;
}
base.addSingletonGetter(User);

User.QUIT = 0;
User.LOGIN = 1;
User.LOGOUT = 2;

User.prototype.getGender = function() {
  var gender = ['', '男', '女'];
  return gender[this.sex] || '未知';
}

/**
 * @return {string}
 */
User.prototype.getDisplayName = function() {
  return this.nickname || this.account;
}

exports.User = User;


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
