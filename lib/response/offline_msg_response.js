/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/offline_msg_response.js ~ 2013/01/03 14:54:28
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');
var constant = require('../constant');
var logger = require('../logger').getLogger(__filename);

function OfflineMsgResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {string}
   */
  this.last_time;

  /**
   * @type {string}
   */
  this.last_id;

  /**
   * BaseResponse里面已经用了type了, 这里避免重复
   * @type {int}
   */
  this.msg_type;

  /**
   * @type {int}
   */
  this.group_id;

  this.create();
}
base.inherits(OfflineMsgResponse, base_response.BaseResponse);

OfflineMsgResponse.prototype.create = function() {
  this.last_time = this.responseHead['last_time'];
  this.last_id = this.responseHead['last_id'];

  this.group_id = parseInt(this.responseHead['gid'], 10) || 0;
  this.msg_type = parseInt(this.responseHead['type'], 10) || 0;

  if (this.bodyData && this.bodyData.length > 0) {
    // TODO(leeight) 貌似消息格式很复杂
    this._registerSystemMessageHandlers();
    this._processBodyData();
  }
}

OfflineMsgResponse.prototype._registerSystemMessageHandlers = function() {
  this._systemMessageHandler = {
    'add_notify': this._onAddNotify,
    'ack_notify': this._onAckNotify,
    'join_notify': this._onJoinNotify,
    'join_ack_notify': this._onJoinAckNotify,
    'delete_member_notify': this._onDeleteMemberNotify,
    'add_manager_notify': this._onAddManagerNotify,
    'delete_member_notify': this._onDeleteManagerNotify,
    'transfer_notify': this._onTransferNotify,
    'transfer_ack_notify': this._onTransferAckNotify,
    'disband_notify': this._onDisbandNotify
  };
}

/**
 * query 1.0 A seq_num
 * method: get_offline_msg
 * code: 200 | 210
 * type: 0 | 1 | 2
 * gid: 群号码
 * last_time: ??
 * last_id: 64位无符号整数
 * content-type: binary
 * content-length: 11122
 * \r\n
 * msgType(32bit) + timeStampHigh(32bit) + timeStampLow(32bit) + msgLength(32bit) + data(长度等于msgLength)
 * msgType(32bit) + timeStampHigh(32bit) + timeStampLow(32bit) + msgLength(32bit) + data(长度等于msgLength)
 * msgType(32bit) + timeStampHigh(32bit) + timeStampLow(32bit) + msgLength(32bit) + data(长度等于msgLength)
 * ...
 * XXX msgType/timeStamp/msgLength 都是网络字节序(BE)
 * @see http://en.wikipedia.org/wiki/Endianness#Endianness_in_networking
 * @private
 */
OfflineMsgResponse.prototype._processBodyData = function() {
  var offset = 0;
  var data = this.bodyData;
  var length = data.length;
  var header_size = 16;

  while(offset < (length - header_size)) {
    var msg_type = data.readInt32BE(offset + 0);
    var timestamp_high = data.readInt32BE(offset + 4);
    var timestamp_low = data.readInt32BE(offset + 8);
    var msg_length = data.readInt32BE(offset + 12);

    var start = offset + header_size;
    var end = start + msg_length;

    if (end <= length) {
      var msg = data.slice(start, end);

      logger.debug('msg_type = [%d]', msg_type);
      logger.debug('timestamp_high = [%d]', timestamp_high);
      logger.debug('timestamp_low = [%d]', timestamp_low);
      logger.debug('msg_length = [%d]', msg_length);
      logger.debug('msg = [%s]', JSON.stringify(msg.toString('utf-8')));

      var father = base_response.BaseResponse.createResponse(msg);
      var cmd = father.command;
      if (cmd === 'msg_notify' ||
          cmd === 'tmsg_request') {
        // 普通的消息.
        this._parseNormalMessage(father);
      } else {
        // TODO(leeight) 还有很多很多种类型的系统消息等待被处理...
        var handler = this._systemMessageHandler[cmd];
        if (handler) {
          var systemMessage = handler.call(this, father);
        }
      }
    }

    offset = end;
  }
}

/**
 * 普通消息
 */
OfflineMsgResponse.prototype._parseNormalMessage = function(father) {
  logger.debug(base.toString(father));

  var msg_type = parseInt(father.responseHead['type'], 10) || 0;
  switch(msg_type) {
    case constant.MessageChat.CHAT_TYPE_DOUBLECHAT:
    case constant.MessageChat.CHAT_TYPE_TEMPCHAT:
    case constant.MessageChat.CHAT_TYPE_TEMPCHATINGROUP: {
      // TODO Friend Chat
      break;
    }
    case constant.MessageChat.CHAT_TYPE_GROUPCHAT: {
      // TODO Group Chat
      break;
    }
    case constant.MessageChat.CHAT_TYPE_MULTICHAT:
    case constant.MessageChat.CHAT_TYPE_UNKNOWNCHAT:
    default: {
      logger.error('invalid msg_type = [%s]', msg_type);
      break;
    }
  }
}

/**
 * 添加 好友消息申请
 */
OfflineMsgResponse.prototype._onAddNotify = function(father) {
}

/**
 * 处理 回应 add or not 好友的消息
 */
OfflineMsgResponse.prototype._onAckNotify = function(father) {
}

/**
 * 申请加入群
 */
OfflineMsgResponse.prototype._onJoinNotify = function(father) {
}

/**
 * 成功 or 拒绝入群通知
 */
OfflineMsgResponse.prototype._onJoinAckNotify = function(father) {
}

/**
 * 被请出群 的通知
 */
OfflineMsgResponse.prototype._onAddManagerNotify = function(father) {
}

/**
 * 成为管理员通知
 */
OfflineMsgResponse.prototype._onDeleteMemberNotify = function(father) {
}

/**
 * 取消管理员通知
 */
OfflineMsgResponse.prototype._onTransferNotify = function(father) {
}

/**
 * 转让群成功 or 拒绝
 */
OfflineMsgResponse.prototype._onTransferAckNotify = function(father) {
}

/**
 * 群解散
 */
OfflineMsgResponse.prototype._onDisbandNotify = function(father) {
}



exports.OfflineMsgResponse = OfflineMsgResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
