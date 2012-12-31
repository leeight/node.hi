/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_protocol.js ~ 2012/12/31 22:30:39
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var protocol = require('./protocol');

exports.testHandshakeHead = function(test) {
  var hsh = new protocol.HandshakeHead();
  test.equal(hsh.toString(), '[protocol.HandshakeHead]:[nReserved1 = 0]:[nReserved2 = 0]:[nDataLen = 0]');
  test.done();
}

exports.testPacketHead = function(test) {
  var ph = new protocol.PacketHead(1, 2, 3, 4);
  test.equal(ph.toString(), '[protocol.PacketHead]:[nVer = \u0000\u0000\u0001\u0000]:[nTag = 1VMI]:[bEncrypt = 1]:[bCompress = 1]:[bHeartBeat = 1]:[nReserved26 = 26]:[nSendFlag = 1]:[nCategory = 0]:[nReserved1 = 0]:[nReserved2 = 0]:[ctFlag = 1]:[nSrcDataLen = 2]:[nZipDataLen = 3]:[nDestDataLen = 4]');
  test.done();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
