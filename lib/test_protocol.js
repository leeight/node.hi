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
var base = require('./base');
var protocol = require('./protocol');

exports.testBaseToString = function(test) {
  test.equal(base.toString({}), '[protocol.Object]');
  test.equal(base.toString(new Object), '[protocol.Object]');
  test.equal(base.toString(new Function), '[protocol.Function]:[length = 0]:[prototype = [protocol.<unknown>]:[constructor = <function>]]:[arguments = <empty>]:[caller = <empty>]:[name = ]');
  test.equal(base.toString(new Date), '[protocol.Date]');
  test.equal(base.toString({a:10,b:'20',c:[1,2,3,],d:/aaa/g}), '[protocol.Object]:[c = 1,2,3]:[d = /aaa/g]:[a = 10]:[b = 20]');
  test.done();
}

exports.testHandshakeHead = function(test) {
  var hsh = new protocol.HandshakeHead();
  test.equal(hsh.toString(), '[protocol.HandshakeHead]:[nReserved1 = 0]:[nReserved2 = 0]:[nDataLen = 0]');
  test.done();
}

exports.testPacketHead = function(test) {
  var ph = new protocol.PacketHead(1, 2, 3, 4);
  test.equal(ph.toString(), '[protocol.PacketHead]:[nCategory = 0]:[nReserved1 = 0]:[nVer = \u0000\u0000\u0001\u0000]:[ctFlag = 1]:[nDestDataLen = 4]:[bEncrypt = 1]:[nReserved26 = 26]:[nReserved2 = 0]:[nTag = 1VMI]:[nSendFlag = 1]:[nZipDataLen = 3]:[nSrcDataLen = 2]:[bCompress = 1]:[bHeartBeat = 1]');
  test.done();
}

exports.testImageRequest = function(test) {
  var ir = new protocol.ImageRequest('5ba67cfecc1d75fa675e6ece56d8f784');
  test.equal(ir.getBytes().length, 37);
  test.equal(ir.getBytes(true).length, 36);
  test.equal(ir.getBytes().toString('base64'), new Buffer([
    0x5b, 0xa6, 0x7c, 0xfe, 0xcc, 0x1d, 0x75, 0xfa,
    0x67, 0x5e, 0x6e, 0xce, 0x56, 0xd8, 0xf7, 0x84,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00
  ]).toString('base64'));
  test.equal(ir.getBytes(true).toString('base64'), new Buffer([
    0x5b, 0xa6, 0x7c, 0xfe, 0xcc, 0x1d, 0x75, 0xfa,
    0x67, 0x5e, 0x6e, 0xce, 0x56, 0xd8, 0xf7, 0x84,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
  ]).toString('base64'));

  ir.a = new Buffer([1,2,3,4,5]);
  test.equal(ir.getBytes().toString('base64'), new Buffer([
    0x5b, 0xa6, 0x7c, 0xfe, 0xcc, 0x1d, 0x75, 0xfa,
    0x67, 0x5e, 0x6e, 0xce, 0x56, 0xd8, 0xf7, 0x84,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05
  ]).toString('base64'));
  test.done();
}

exports.testImageResponse = function(test) {
  test.done();
}

exports.testImagePacket = function(test) {
  test.done();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
