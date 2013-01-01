/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * model.js ~ 2013/01/01 14:53:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 几个实体User, Friend, ChatInfo之类的.
 **/
var constant = require('./constant');

/**
 * @constructor
 * @param {string} account
 * @param {string} password
 */
function User(account, password) {
  /**
   * @type {string}
   */
  this.imversion = "1,0,0,0";

  /**
   * @type {int}
   */
  this.priority = constant.LoginPriority.CLIENT;

  /**
   * @type {int}
   */
  this.client_type = constant.ClientType.ClientNormal;

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
  this.account = account;

  /**
   * @type {string}
   */
  this.password = password;

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


/**
 * @constructor
 */
function Friend() {
  /**
   * @type {int}
   */
  this.status;

  /**
   * @type {int}
   */
  this.imid;

  /**
   * FIXME(leeight) 什么意思呢?
   * @type {int}
   */
  this.team;

  /**
   * FIXME(leeight) 什么意思呢?
   * @type {int}
   */
  this.validated;

  /**
   * @type {string}
   */
  this.personal_comment;

  /**
   * @type {string}
   */
  this.nickname;

  /**
   * 备注
   */
  this.monicker;

  /**
   * @type {string}
   */
  this.avatar;

  /**
   * @type {string}
   */
  this.name;

  /**
   * @type {string}
   */
  this.birthday;

  /**
   * @type {string}
   */
  this.personal_desc;

  /**
   * @type {int}
   */
  this.sex;

  /**
   * @type {int}
   */
  this.client_type;

  /**
   * @type {int}
   */
  this.timestamp;

  /**
   * @type {int}
   */
  this.has_camera;

  /**
   * @type {string}
   */
  this.music;

  /**
   * @type {int}
   */
  this.psp_status;

  /**
   * @type {string}
   */
  this.email;
}
/**
 * 定义模型的主键.
 * @return {string}
 */
Friend.prototype.getPrimaryKey = function() {
  return String(this.imid);
}

/**
 * @constructor
 */
function ChatInfo() {
  /**
   * @type {int}
   */
  this.type = 1;

  /**
   * @type {int}
   */
  this.from_id = 0;

  /**
   * @type {int}
   */
  this.to_id = 0;

  /**
   * @type {int}
   */
  this.time = Date.now();

  /**
   * @type {int}
   */
  this.base_msg_id = 56792536;

  /**
   * @type {int}
   */
  this.msg_id = 2;

  /**
   * @type {int}
   */
  this.sub_id = 0;

  /**
   * @type {int}
   */
  this.next_sub_id = 0;

  /**
   * @type {int}
   */
  this.wait_ack = 120;

  /**
   * @type {string}
   */
  this.thumbnail_url;

  /**
   * @type {int}
   */
  this.display_image_type = constant.ImageType.NULL;

  /**
   * @type {string}
   */
  this.display_message;
}


exports.User = User;
exports.Friend = Friend;
exports.ChatInfo = ChatInfo;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
