/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/msg_ack_notify_response.js ~ 2013/01/01 15:51:07
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 处理对方的msg_msg_ack回包
 **/
var base_response = require('./base_response');
var base = require('../base');

function MsgAckNotifyResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * 在此之前的MsgRequestCommand都已经被收到了.
   * 可以从队列里面去掉了.
   * @type {int}
   */
  this.last_ack;

  if (this.xml) {
    this.create();
  }
}
base.inherits(MsgAckNotifyResponse, base_response.BaseResponse);

/**
 * "msg 1.2 N 1186\r\ncontent-length:39\r\ncontent-type:text\r\nfrom:16897023\r\nfrom_sub:0\r\nmethod:msg_ack_notify\r\nsys_sess:00340100abcd020050e295150101d3ff000000000a410cd23e80000050e294b606da2964000000000a2e6e343e80000050e294cf\r\nto:114960740\r\nto_sub:0\r\ntype:1"
 */
MsgAckNotifyResponse.prototype.create = function() {
  // "<acks><ack id=\"1357026576426\"/></acks>\u0000"
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml.replace(/\u0000/g, ''));
  var acks = doc.documentElement;

  var last_ack = 0;

  for(var i = 0, j = acks.childNodes.length; i < j; i ++) {
    var ack = acks.childNodes[i];
    if (ack.nodeType === 1 &&
        ack.nodeName === 'ack') {
      var id = parseInt(ack.getAttribute('id'), 10) || 0;
      if (id > last_ack) {
        last_ack = id;
      }
    }
  }

  this.last_ack = last_ack;
}

exports.MsgAckNotifyResponse = MsgAckNotifyResponse;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
