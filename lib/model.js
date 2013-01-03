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

/**
 * @return {string}
 */
User.prototype.getDisplayName = function() {
  return this.nickname || this.account;
}

var Friend = persist.define('friends', {
  status: type.INTEGER,
  imid: type.INTEGER,
  baiduid: type.STRING,
  team: type.INTEGER,
  validated: type.INTEGER,
  personal_comment: type.STRING,
  nickname: type.STRING,
  monicker: type.STRING,            // 备注
  avatar: type.STRING,              // 头像
  name: type.STRING,
  birthday: type.STRING,
  personal_desc: type.STRING,
  sex: type.INTEGER,
  client_type: type.INTEGER,
  timestamp: type.INTEGER,
  has_camera: type.INTEGER,
  music: type.STRING,
  psp_status: type.INTEGER,
  email: type.STRING
});

Friend.save = function(friends) {
  persist.connect({
    driver: 'sqlite3',
    filename: 'data/db/hi_friends.sqlite',
    trace: !true
  }, function(err, connection){
    Model.createTable(Friend, connection, function(err){
      if (err) {
        throw err;
      }

      friends.forEach(function(friend){
        logger.debug(base.toString(friend));
        friend.save(connection, function(err){
          if (err) {
            throw err;
          }
        });
      });

      // FIXME
      connection.close();
    });
  });
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
exports.Model = Model;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
