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
    this._processBodyData();
  }
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
      if (father.command === 'msg_notify' ||
          father.command === 'tmsg_request') {
        // 普通的消息.
        logger.debug(base.toString(father));
      } else {
        // TODO(leeight) 还有很多很多种类型的消息...
      }
    }

    offset = end;
  }
}

exports.OfflineMsgResponse = OfflineMsgResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
