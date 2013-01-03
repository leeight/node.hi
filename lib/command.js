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
var utils = require('./utils');
var logger = require('./logger').getLogger(__filename);

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

BaseCommand.prototype.toString = function() {
  return base.toString(this);
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
 * <login>
 *   <user account="leeight" password="password" imversion="1,2,3,4"
 *         redirect_times="0" priority="20" platform="android"
 *         client_type="4" new_username="user.new_username" />
 * </login>
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

/**
 * @param {int} status 状态.
 * @param {string} msg 签名.
 * @param {int} imid 用户的id.
 * @extends {BaseCommand}
 */
function UserSetStatus(status, msg, imid) {
  BaseCommand.call(this, "user", "set", "2.0");

  /**
   * @type {int}
   */
  this.status = status;

  /**
   * @type {string}
   */
  this.msg = msg;

  this.addCommandHead("uid", imid);
}
base.inherits(UserSetStatus, BaseCommand);

UserSetStatus.prototype.createCommandBody = function() {
  var status = this.status + (!this.msg ? '' : ';' + this.msg);
  var statusValue = require('entities').encode(status, 0);
  return '<user><account status="' + statusValue + '"/></user>';
}

/**
 * @param {User} user
 */
function LoginReadyCommand(user) {
  BaseCommand.call(this, "user", "login_ready", "2.0");

  this._user = user;

  this.addCommandHead("uid", user.imid);
}
base.inherits(LoginReadyCommand, BaseCommand);

/**
 * <login><user status="uint32_t;string" imversion="imver_t" localeid="uint16_t" pc_hash="uint64_t" /></login>
 */
LoginReadyCommand.prototype.createCommandBody = function() {
  var entities = require('entities');
  var user = this._user;
  var pc_hash = utils.getSoftwareUUID(security.md5sum(user.account));

  return '<login><user status="' + user.user_status +
         '" imversion="' + entities.encode(user.imversion, 0) +
         '" localeid="' + constant.LocaleType.LocaleSimpleChinese +
         '" pc_hash="' + entities.encode(pc_hash, 0) + '" /></login>';
}

/**
 * @constructor
 * @param {User} user
 * @extends {BaseCommand}
 */
function UserQueryCommand(user) {
  BaseCommand.call(this, "user", "query", "1.14");

  this._user = user;

  this.addCommandHead("uid", user.imid);
}
base.inherits(UserQueryCommand, BaseCommand);

UserQueryCommand.prototype.createCommandBody = function() {
  return "<query fields=\"" + constant.QueryFields.USER_QUERY_FIELDS + "\" />";
}


/**
 * 这个注意一下, 调用的时候from_id和to_id的顺序是相反的.
 * @param {int} msg_type
 * @param {int} from_id
 * @param {int} to_id
 * @param {string} time
 * @param {int} imid
 */
function MsgAckCommand(msg_type, from_id, to_id, time, imid) {
  BaseCommand.call(this, "msg", "msg_ack", "1.1");

  this.time = time;

  this.addCommandHead('type', String(msg_type));
  this.addCommandHead('uid', String(imid));
  this.addCommandHead('from', String(from_id));
  this.addCommandHead('to', String(to_id));
}
base.inherits(MsgAckCommand, BaseCommand);

MsgAckCommand.prototype.createCommandBody = function() {
  return '<acks><ack id="' + this.time + '" /></acks>';
}

/**
 * 从服务器获取静态的配置信息
 * @constructor
 * @extends {BaseCommand}
 */
function GetStaticConfigCommand() {
  BaseCommand.call(this, 'config', 'get_static_config', '2.0');
}
base.inherits(GetStaticConfigCommand, BaseCommand);

GetStaticConfigCommand.prototype.createCommandBody = function() {
  return null;
}

/**
 * 给好友发送消息
 * @param {int} imid
 * @param {Object} chat_info
 */
function MsgRequestCommand(imid, chat_info) {
  BaseCommand.call(this, 'msg', 'msg_request', '1.0');

  /**
   * @type {int}
   */
  this.imid = imid;

  /**
   * @type {Object}
   */
  this.chat_info = chat_info;

  this._setCommandHead();
}
base.inherits(MsgRequestCommand, BaseCommand);

MsgRequestCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
  this.addCommandHead('type', this.chat_info.type);
  this.addCommandHead('from', this.chat_info.from_id);
  this.addCommandHead('to', this.chat_info.to_id);
  this.addCommandHead('time', this.chat_info.time);
  this.addCommandHead('basemsgid', this.chat_info.base_msg_id);
  this.addCommandHead('msgid', this.chat_info.msg_id);
  this.addCommandHead('subid', this.chat_info.sub_id);
  this.addCommandHead('nextsubid', this.chat_info.next_sub_id);
  this.addCommandHead('waitack', this.chat_info.wait_ack);
}

MsgRequestCommand.prototype._createImageMessage = function() {
  var path = require('path');
  var entities = require('entities');
  var fs = require('fs');

  var image_path = this.chat_info.thumbnail_url.trim();
  var extname = path.extname(image_path);
  if (extname.length <= 1) {
    logger.error('invalid image path, can\'t guess the image type');
    return null;
  }
  var basename = path.basename(image_path, extname);
  var type = extname.substr(1);
  var md5sum = security.md5sum(fs.readFileSync(image_path));

  var message = [];

  message.push('<msg>');
  message.push('<font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />');
  message.push('<img path="' + entities.encode(image_path, 0) + '" md5="' + md5sum + '" t="' + type + '" n="' + basename + '" />');
  message.push('</msg>');

  return message.join('');
}

MsgRequestCommand.prototype.createCommandBody = function() {
  logger.debug('MsgRequestCommand.prototype.createCommandBody');

  if (this.chat_info.thumbnail_url &&
      this.chat_info.display_image_type != constant.ImageType.NULL) {
    return this._createImageMessage();
  }

  // TODO(leeight) 表情, 图片之类的处理
  var entities = require('entities');
  var display_message = this.chat_info.display_message;

  var message = [];
  message.push('<msg>');
  message.push('<font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />');
  message.push('<text c="' + entities.encode(display_message, 0) + '" />');
  message.push('</msg>');

  return message.join('');
}

/**
 * 从服务器拉取好友信息(主要是imid, 更详细的信息要从ContactQueryCommand中获取)
 * @param {int} imid 当前登陆用户的imid.
 * @param {int=} opt_page 页码, 默认第0页.
 * @extends {BaseCommand}
 */
function FriendFetchCommand(imid, opt_page) {
  BaseCommand.call(this, 'friend', 'get_friend', '2.10');

  /**
   * @type {int}
   */
  this.imid = imid;

  /**
   * 貌似是team id的意思.
   * @type {int}
   */
  this.tid = -1;

  /**
   * @type {int}
   */
  this.page = opt_page || 0;

  this._setCommandHead();
}
base.inherits(FriendFetchCommand, BaseCommand);

FriendFetchCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
  this.addCommandHead('pagesize', 50);
  this.addCommandHead('page', this.page);
  if (this.tid >= 0) {
    this.addCommandHead('tid', this.tid);
  }
}

FriendFetchCommand.prototype.createCommandBody = function() {
  return null;
}

/**
 * 从服务器查询好友的详细信息.
 * @constructor
 * @param {Array.<model.Friend>} friends
 * @param {int} imid
 * @extends {BaseCommand}
 */
function ContactQueryCommand(friends, imid) {
  BaseCommand.call(this, "contact", "query", "3.15");

  /**
   * @type {Array.<model.Friend>}
   */
  this.friends = friends;

  /**
   * @type {int}
   */
  this.imid = imid;

  this._setCommandHead();
}
base.inherits(ContactQueryCommand, BaseCommand);

ContactQueryCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
}

ContactQueryCommand.prototype.createCommandBody = function() {
  var friendIds = [];
  this.friends.forEach(function(friend){
    if (friend.imid) {
      friendIds.push(friend.imid);
    }
  });

  return '<query fields="' + constant.QueryFields.FRIEND_QUERY_FIELDS + '" id="' + friendIds.join(';') + '" />';
}

/**
 * FIXME(leeight) 貌似服务器返回405, 需要验证码?
 * 从服务器拉取群信息
 * @param {int} imid 当前登陆用户的imid.
 * @extends {BaseCommand}
 */
function GroupFetchCommand(imid) {
  BaseCommand.call(this, "group", "group_list", "3.0");

  this.imid = imid;

  this._setCommandHead();
}
base.inherits(GroupFetchCommand, BaseCommand);

GroupFetchCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
}

GroupFetchCommand.prototype.createCommandBody = function() {
  return null;
}

/**
 * 获取离线消息数量.
 * @param {int} type 0表示取单人的离线消息，包括通知类消息，
 * 1表示取群的消息，包括群的通知类消息.
 * @param {int} msg_type 0表示取“请求”，1表示取“消息”.
 * @param {int} group_id type是1的时候才有这个字段，
 * 表示要获取哪个群里面的消息，0表示从头取.
 * @param {int} imid
 * @extends {BaseCommand}
 */
function OfflineMsgCountCommand(type, msg_type, group_id, imid) {
  BaseCommand.call(this, "query", "offline_msg_count", "1.0");
  this.type = type;
  this.msg_type = msg_type;
  this.group_id = group_id;
  this.imid = imid;
  this._setCommandHead();
}
base.inherits(OfflineMsgCountCommand, BaseCommand);

OfflineMsgCountCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
  this.addCommandHead('type', this.type);
  this.addCommandHead('msg_type', this.msg_type);
  if (this.type === 1) {
    this.addCommandHead('gid', this.group_id);
  }
}

OfflineMsgCountCommand.prototype.createCommandBody = function() {
  return null;
}

/**
 * 从服务器拉取真正的离线消息.
 * @param {int} type
 * @param {int} group_id
 * @param {string} start_time
 * @param {string} start_id
 * @param {int} imid
 * @extends {BaseCommand}
 */
function OfflineMsgCommand(type, group_id, start_time, start_id, imid) {
  BaseCommand.call(this, "query", "get_offline_msg", "1.0");

  /**
   * 0: 个人系统消息
   * 1: 群消息
   * 2: 个人聊天消息
   * 3: 主子账户之间的聊天消息
   * FIXME(leeight) 下面这句话是什么意思?
   * (老CS收到type为0的包时，返回所有的个人离线消息，收到type为2和3的包，返回400)
   * @type {int}
   */
  this.type = type;

  /**
   * type是1的时候才有这个字段，表示要获取哪个群里面的消息，0表示从头取
   * @type {int}
   */
  this.group_id = group_id;

  /**
   * 0: 表示从头取
   * 其他值: 表示从该时间开始取
   * @type {string} 64位整数, client每次请求将上一次server答包中的last_time带到这里
   */
  this.start_time = start_time;

  /**
   * 0: 表示从头取
   * 其他值: 表示获取 (时间 >= start_time && id > start_msg_stamp)
   * @type {string}
   */
  this.start_id = start_id;

  /**
   * 当前登陆人的imid.
   * @type {int}
   */
  this.imid = imid;

  this._setCommandHead();
}
base.inherits(OfflineMsgCommand, BaseCommand);

OfflineMsgCommand.prototype._setCommandHead = function() {
  this.addCommandHead('uid', this.imid);
  this.addCommandHead('start_time', this.start_time);
  this.addCommandHead('start_id', this.start_id);
  this.addCommandHead('type', this.type);
  if (this.type === 1) {
    this.addCommandHead('gid', this.group_id);
  }
}

OfflineMsgCommand.prototype.createCommandBody = function() {
  return null;
}













exports.BaseCommand = BaseCommand;
exports.LoginCommand = LoginCommand;
exports.VerifyCommand = VerifyCommand;
exports.UserSetStatus = UserSetStatus;
exports.LoginReadyCommand = LoginReadyCommand;
exports.UserQueryCommand = UserQueryCommand;
exports.MsgAckCommand = MsgAckCommand;
exports.GetStaticConfigCommand = GetStaticConfigCommand;
exports.MsgRequestCommand = MsgRequestCommand;
exports.FriendFetchCommand = FriendFetchCommand;
exports.GroupFetchCommand = GroupFetchCommand;
exports.ContactQueryCommand = ContactQueryCommand;
exports.OfflineMsgCountCommand = OfflineMsgCountCommand;
exports.OfflineMsgCommand = OfflineMsgCommand;


/* vim: set ts=4 sw=4 sts=4 tw=100: */
