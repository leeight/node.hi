/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * logic/friend.js ~ 2013/01/01 20:53:50
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var events = require('events');
var base = require('../base');
var constant = require('../constant');
var command = require('../command');
var logger = require('../logger').logger;

/**
 * @extends {events.EventEmitter}
 */
function Friend() {
  events.EventEmitter.call(this);

  this.on('_on_friend_get_friend', this._onFetchFriend.bind(this));
  this.on('message', this.onMessage.bind(this));
}
base.inherits(Friend, events.EventEmitter);

/**
 * @param {response.FriendGetFriendResponse} response
 * @param {lnet.NetManager} nm
 */
Friend.prototype._onFetchFriend = function(response, nm) {
  var seq = response.seq;

  switch(response.code) {
    case constant.StatusCode.SUCCESS: {
      logger.debug('constant.StatusCode.SUCCESS');
      nm.getClient().emit('friend_list', response.friends);
      break;
    }
    case constant.StatusCode.HAS_MORE: {
      logger.debug('constant.StatusCode.HAS_MORE');
      nm.getClient().emit('friend_list', response.friends);

      // command.FriendFetchCommand
      var cmd = nm.findCommand(seq);
      if (cmd) {
        var page = cmd.page + 1;
        var imid = cmd.imid;
        nm.sendMessage(new command.FriendFetchCommand(imid, page));
      } else {
        logger.error('Cant\' find command from lnet.NetManager, seq = [' + seq + ']');
      }
      break;
    }
  }

  nm.removeCommand(seq);
}

/**
 * @param {BaseResponse} response
 * @param {NetManager} nm
 */
Friend.prototype.onMessage = function(response, nm) {
  var cmd = response.command;
  var protocolType = (response.superCommand + '_' + cmd).toLowerCase();
  logger.debug('Friend.prototype.onMessage, cmd = [' + cmd +
    '], protocolType = [' + protocolType + ']');

  switch(protocolType) {
    case 'friend_get_friend':
      this.emit('_on_' + protocolType, response, nm);
      return;
  }
}

exports.Friend = Friend;






















/* vim: set ts=4 sw=4 sts=4 tw=100: */
