/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * notification.js ~ 2012/12/29 21:33:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 收到消息之后的处理函数
 **/
var events = require('events');
var base = require('../base');
var constant = require('../constant');
var command = require('../command');
var utils = require('../utils');
var logger = require('../logger').logger;

function Notification() {
  events.EventEmitter.call(this);

  this.on('_on_msg_msg_notify', this._onMsgNotify.bind(this));
  this.on('message', this.onMessage.bind(this));
}
base.inherits(Notification, events.EventEmitter);

/**
 * @param {response.MsgNotifyResponse} response
 * @param {lnet.NetManager} nm
 */
Notification.prototype._onMsgNotify = function(response, nm) {
  logger.debug('Notification.prototype._onMsgNotify');

  switch(response.msg_type) {
    case constant.MessageChat.CHAT_TYPE_DOUBLECHAT:
    case constant.MessageChat.CHAT_TYPE_TEMPCHAT:
    case constant.MessageChat.CHAT_TYPE_TEMPCHATINGROUP: {
      if (response.type !== 'A') {
        // TODO(leeight) 普通消息的处理
        // 1. 解析XML的消息到文本消息
        // 2. 存储到本地或者云存储上面去
        // 3. 通知nm.getClient()新的消息
        nm.getClient().emit('new_message', response);
      }

      if (response.wait_ack > 0) {
        nm.sendMessage(new command.MsgAckCommand(response.msg_type,
          response.to_id, response.from_id, response.time,
          nm.getClient().getUser().imid));
      }
      break;
    }
    case constant.MessageChat.CHAT_TYPE_GROUPCHAT: {
      logger.info('constant.MessageChat.CHAT_TYPE_GROUPCHAT');
      break;
    }
    case constant.MessageChat.CHAT_TYPE_MULTICHAT:
    case constant.MessageChat.CHAT_TYPE_UNKNOWNCHAT: {
      logger.error('invalid msg_type = [' + response.msg_type + ']');
      break;
    }
  }
}

Notification.prototype.onMessage = function(response, nm) {
  var cmd = response.command;
  var protocolType = (response.superCommand + '_' + cmd).toLowerCase();
  logger.debug('Notification.prototype.onMessage');
  logger.debug('cmd = [' + cmd + ']');
  logger.debug('protocolType = [' + protocolType + ']');

  switch(protocolType) {
    case 'msg_msg_notify':
      this.emit('_on_' + protocolType, response, nm);
      return;
  }

  logger.error('invalid cmd = [' + cmd + '] or protocolType = [' + protocolType + ']');
}

exports.Notification = Notification;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
