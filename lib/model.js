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
var base = require('./base');
var security = require('./security');
var logger = require('./logger').getLogger(__filename);
var persist = require("persist");
var type = persist.type;

function Model() {
}

/**
 * 1. persist没有提供自动创建table的功能, 这里补充实现一下.
 * 2. 不考虑model之间association的情况, 因为我们这个貌似没有这个需求的.
 * 3. 也只考虑对sqlite3的支持.
 * @param {persist.Model} m
 * @param {persist.Connection} c
 * @param {Function=} opt_callback
 */
Model.createTable = function(m, c, opt_callback) {
  // CREATE TABLE ${tableName} (
  //   ${columnName} ${columnsDef}
  // );
  var tableName = m.tableName;
  var columns = m.columns;
  var columnDefs = [];
  var callback = opt_callback || function(){};

  var map = {
    'int': 'integer',
    'string': 'text'
  };

  for(var k in columns) {
    if(columns.hasOwnProperty(k)) {
      var item = columns[k];
      var def = '  ' + item.dbColumnName + ' ' + (map[item.type] || item.type);
      if (item.primaryKey === true) {
        def += ' PRIMARY KEY';
      }
      if (item.autoIncrement === true) {
        def += ' AUTOINCREMENT';
      }
      columnDefs.push(def);
    }
  }

  var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (\n' + columnDefs.join(',\n') + '\n);';
  c._runSql(sql, callback);
}


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

User.prototype.getAvatar = function() {
  var host = 'http://127.0.0.1:1337/';

  if (this.avatar) {
    var chunks = this.avatar.split('.');
    return host + constant.IMAGE_HEAD + '/' + chunks[0] + '.' + chunks[1];
  } else {
    return host + constant.IMAGE_HEAD + '/0.jpg';
  }
}

/**
 * @return {string}
 */
User.prototype.getDisplayName = function() {
  return this.nickname || this.account;
}

function Friend() {
  /** @type {int} */
  this.status;

  /** @type {int} */
  this.imid;

  /** @type {int} */
  this.baiduid;

  /** @type {int} */
  this.team;

  /** @type {int} */
  this.validated;

  /** @type {string} */
  this.personal_comment;

  /** @type {string} */
  this.nickname;

  /** @type {string} */
  this.monicker;

  /** @type {string} */
  this.avatar;

  /** @type {string} */
  this.name;

  /** @type {string} */
  this.birthday;

  /** @type {string} */
  this.personal_desc;

  /** @type {int} */
  this.sex;

  /** @type {int} */
  this.client_type;

  /** @type {int} */
  this.timestamp;

  /** @type {int} */
  this.has_camera;

  /** @type {string} */
  this.music;

  /** @type {int} */
  this.psp_status;

  /** @type {string} */
  this.email;

  /** @type {string} */
  this.info_open_level;       // 2

  /** @type {string} */
  this.vitality;              // 1043;25;31
}
Friend.save = function(){};

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


/**
 * @constructor
 * @param {string} md5 File md5.
 * @param {int} type IMAGE_CHAT | IMAGE_HEAD
 * @param {string} ext File extension.
 * @param {string} localFile Local file path.
 * @param {int} to_id The receiver internal baidu id.
 */
function Image(md5, type, ext, localFile, to_id) {
  /** @type {string} */
  this.md5 = md5;

  /** @type {int} */
  this.type = type;

  /** @type {string} */
  this.ext = ext;

  /** @type {string} */
  this.localFile = localFile;

  /** @type {int} */
  this.to_id = to_id;

  /**
   * 指的是上传还是下载
   * @type {int}
   */
  this.direction;
}

/**
 * @param {string} localFile
 * @param {int=} opt_to_id
 */
Image.create = function(localFile, opt_to_id) {
  var fs = require('fs');
  var path = require('path');

  if (!localFile || !fs.existsSync(localFile)) {
    return null;
  }

  var ext = path.extname(localFile);
  if (!ext || ext.length <= 1) {
    return null;
  }

  ext = ext.substr(1);
  var md5 = security.md5sum(fs.readFileSync(localFile));

  var instance = new Image(md5, constant.IMAGE_CHAT, ext, localFile, opt_to_id);
  instance.direction = constant.IMAGE_IS_UP;

  return instance;
}

exports.Image = Image;
exports.User = User;
exports.Friend = Friend;
exports.ChatInfo = ChatInfo;
exports.Model = Model;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
