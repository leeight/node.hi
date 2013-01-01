/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/msg_notify_response.js ~ 2012/12/29 16:19:36
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');

function MsgNotifyResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  this.time;
  this.from_id;
  this.to_id;

  this.uid = 0;
  this.msg_type = 0;
  this.msg_id = 0;
  this.base_msg_id = 0;
  this.wait_ack = 0;

  this.create();
}
base.inherits(MsgNotifyResponse, base_response.BaseResponse);

MsgNotifyResponse.prototype._getHeadValue = function(key) {
  var value = this.responseHead[key];
  delete this.responseHead[key];
  return value;
}
MsgNotifyResponse.prototype.create = function() {
  if (this.command.toLowerCase() === 'tmsg_request' &&
      this.type === 'A') {
    // 返回T message A包不做解析(??)
    return;
  }

  var type = this._getHeadValue('type');
  if (type) {
    this.msg_type = parseInt(type, 10) || 0;
  }

  // 和登录，from，to，type相关的一个随机数，会话过程中不变
  var basemsgid = this._getHeadValue('basemsgid');
  if (basemsgid) {
    this.base_msg_id = parseInt(basemsgid, 10) || 0;
  }

  // 消息的主id，表示逻辑消息，拆包的话各个子消息的msgid相同
  var msgid = this._getHeadValue('msgid');
  if (msgid) {
    this.msg_id = parseInt(msgid, 10) || 0;
  }

  // 消息的子id
  // subid

  // 消息的下一个子id, 0表示后面没有了
  // nextsubid

  // 如果发送方需要应答，接收方带上应答信息回包给发送方，一个消息包中可以包含消息请求和ack双重信息
  // 格式：msgid;submsgid，收到了这个消息之前的所有消息
  // ack

  this.from_id = parseInt(this._getHeadValue('from'), 10);
  // 联系人ID | 群ID | 临时群ID
  this.to_id = parseInt(this._getHeadValue('to'), 10);
  this.time = this._getHeadValue('time');

  var uid = this._getHeadValue('uid');
  if (uid && ("null" != uid.toLowerCase().trim())) {
    this.uid = parseInt(uid, 10) || 0;
  }

  // 是否需要应答以及等待应答的超时时间，-1(或者-1的uint32_t表示值)表示不需要应答
  var waitack = this._getHeadValue('waitack');
  if (waitack && ("null" != waitack.toLowerCase().trim())) {
    this.wait_ack = parseInt(waitack, 10) || 0;
  }

  var illegal = this._getHeadValue('illegal');
  if (illegal) {
    // 401 | 402
    logger.error('illegal msg, status code = [' + illegal + ']');
  }
}

exports.MsgNotifyResponse = MsgNotifyResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
