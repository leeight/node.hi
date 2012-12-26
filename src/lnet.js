/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lnet.js ~ 2012/12/26 21:26:17
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var protocol = require('./protocol');
var logger = require('./logger').logger;

/**
 * @param {Socket} socket
 */
function NetManager(socket) {
  this.socket = socket;

  this.sendedCommand = {};
}
NetManager.messageId = 1;

/**
 * @return {int}
 */
NetManager.getNextId = function() {
  return NetManager.messageId ++;
}

NetManager.prototype.cacheCommand = function(command) {
  this.sendedCommand[command.seq] = command;
}

NetManager.prototype.removeCommand = function(seq) {
  if (this.sendedCommand[seq]) {
    delete this.sendedCommand[seq];
  }
}

/**
 * @param {BaseCommand} command
 */
NetManager.prototype.sendMessage = function(command) {
  var packet = new protocol.Packet();
  packet.packetHead = protocol.PacketHead.MESSAGE;
  var msg = command.createCommand();
  logger.debug(msg);
  packet.message = new protocol.Message(new Buffer(msg, 'utf-8'));
  this.socket.write(packet.getBytes());
  this.cacheCommand(command);
  return command.seq;
}

exports.NetManager = NetManager;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
