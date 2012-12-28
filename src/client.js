/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * client.js ~ 2012/12/23 11:58:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var net = require('net')
var command = require('./command');
var constant = require('./constant');
var lnet = require('./lnet');
var logger = require('./logger').logger;

var NET_MANAGER;

function login() {
  var msg = new command.VerifyCommand(constant.VerifyCodeType.VerifyCodeLogin, 0, 'linuxracer', 0, 0);
  var seq = NET_MANAGER.sendMessage(msg);
  logger.debug('login command seq = [' + seq + ']');
}

var socket = net.createConnection(1863, "m1.im.baidu.com");
socket.on('connect', function (connect) {
  logger.debug('connection established');
  NET_MANAGER = new lnet.NetManager(this);
  NET_MANAGER.on('finish_handshake', function(){
    login();
  });
  NET_MANAGER.startHandshake();
});
socket.on('error', function (error) {
  logger.error(error);
});
socket.on('end', function () {
  logger.debug('socket closing...');
});
socket.setKeepAlive(true, 1000);




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
