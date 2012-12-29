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
  this.uid = 0;
  this.msg_type = 0;
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

  var basemsgid = this._getHeadValue('basemsgid');
  if (basemsgid) {
    this.base_msg_id = parseInt(basemsgid, 10) || 0;
  }

  this.from_id = parseInt(this._getHeadValue('from'), 10);
  this.to_id = parseInt(this._getHeadValue('to'), 10);
  this.time = this._getHeadValue('time');

  var uid = this._getHeadValue('uid');
  if (uid && ("null" != uid.toLowerCase().trim())) {
    this.uid = parseInt(uid, 10) || 0;
  }

  var waitack = this._getHeadValue('waitack');
  if (waitack && ("null" != waitack.toLowerCase().trim())) {
    this.wait_ack = parseInt(waitack, 10) || 0;
  }
}

exports.MsgNotifyResponse = MsgNotifyResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
