/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * protocol.js ~ 2012/12/23 10:59:24
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var constant = require('./constant');
var base = require('./base');
var utils = require('./utils');
var security = require('./security');
var logger = require('./logger').logger;
var ECtFlagConnectStates = constant.ECtFlagConnectStates;
var ProtocolConstant = constant.ProtocolConstant;
var ECtSendFlags = constant.ECtSendFlags;

function HandshakeHead() {
  /**
   * @type {int}
   */
  this.nReserved1 = 0;    // 保留字段

  /**
   * @type {int}
   */
  this.nReserved2 = 0;    // 保留字段

  /**
   * @type {int}
   */
  this.nDataLen = 0;      // 后续数据长度
}

/**
 * @return {Buffer}
 */
HandshakeHead.prototype.getBytes = function() {
  return null;
}

HandshakeHead.prototype.toString = function() {
  var message = ['[protocol.' + (this.constructor.name || '<unknown>') + ']'];
  for(var key in this) {
    if (this.hasOwnProperty(key)) {
      message.push('[' + key + ' = ' + this[key] + ']');
    }
  }
  return message.join(':');
}



function HandshakeBody() {
  /**
   * @type {Buffer}
   */
  this.keyData;
}

/**
 * @return {int}
 */
HandshakeBody.prototype.getLength = function() {
  if (this.keyData) {
    return this.keyData.length;
  }
  return 0;
}


function S1Data() {
  HandshakeHead.call(this);
  /**
   * @type {byte}
   */
  this.nEPVer = 1;

  /**
   * @type {Array.<byte>}
   */
  this.nConMethod = ProtocolConstant.CON_METHOD_A;
}
base.inherits(S1Data, HandshakeHead);

/**
 * @return {Buffer}
 */
S1Data.prototype.getBytes = function() {
  // 1: nEPVer
  // 4: nConMethod
  // 4: nReserved1
  // 4: nReserved2
  // 4: nDataLen

  var bytes = new Buffer(17);
  bytes.fill(0);
  bytes.writeInt8(this.nEPVer, 0);
  bytes.writeInt8(this.nConMethod[0], 1);
  bytes.writeInt8(this.nConMethod[1], 2);
  bytes.writeInt8(this.nConMethod[2], 3);
  bytes.writeInt8(this.nConMethod[3], 4);
  bytes.writeInt32LE(this.nReserved1, 5);
  bytes.writeInt32LE(this.nReserved2, 9);
  bytes.writeInt32LE(this.nDataLen, 13);

  return bytes;
}

function S2Data() {
  HandshakeHead.call(this);

  /**
   * 会话策略
   * @type {bytes}
   */
  this.nConMethod;

  /**
   * RootKey编号
   * @type {byte}
   */
  this.nRootKeyNO;

  /**
   * RootKey长度
   * @type {int}
   */
  this.nRootKeyLen;
}
base.inherits(S2Data, HandshakeHead);

/**
 * @return {Buffer}
 */
S2Data.prototype.getBytes = function() {
  // 1: nConMethod
  // 1: nRootKeyNO
  // 4: nRootKeyLen
  // 4: nReserved1
  // 4: nReserved2
  // 4: nDataLen

  var bytes = new Buffer(18);
  bytes.writeInt8(this.nConMethod, 0);
  bytes.writeInt8(this.nRootKeyNO, 1);
  bytes.writeInt32LE(this.nRootKeyLen, 2);
  bytes.writeInt32LE(this.nReserved1, 6);
  bytes.writeInt32LE(this.nReserved2, 10);
  bytes.writeInt32LE(this.nDataLen, 14);

  return bytes;
}

/**
 * @param {Buffer} bytes
 */
S2Data.createFromBytes = function(bytes) {
  var packet = new S2Data();
  packet.nCategory = bytes.readInt8(0);
  packet.nRootKeyNO = bytes.readInt8(1);
  packet.nRootKeyLen = bytes.readInt32LE(2);
  packet.nReserved1 = bytes.readInt32LE(6);
  packet.nReserved2 = bytes.readInt32LE(10);
  packet.nDataLen = bytes.readInt32LE(14);
  return packet;
}

function S3Data() {
  HandshakeHead.call(this);
}
base.inherits(S3Data, HandshakeHead);

/**
 * @return {Buffer}
 */
S3Data.prototype.getBytes = function() {
  // 4: nReserved1
  // 4: nReserved2
  // 4: nDataLen

  var bytes = new Buffer(12);
  bytes.writeInt32LE(this.nReserved1, 0);
  bytes.writeInt32LE(this.nReserved2, 4);
  bytes.writeInt32LE(this.nDataLen, 8);

  return bytes;
}

/**
 * @param {Buffer} bytes
 * @return {S4Data}
 */
S3Data.createFromBytes = function(bytes) {
  var packet = new S3Data();
  packet.nReserved1 = bytes.readInt32LE(0);
  packet.nReserved2 = bytes.readInt32LE(4);
  packet.nDataLen = bytes.readInt32LE(8);

  return packet;
}

function S4Data() {
  HandshakeHead.call(this);

  /**
   * @type {byte[16]}
   */
  this.seed;

  /**
   * @type {int}
   */
  this.nKeepAliveSpace;
}
base.inherits(S4Data, HandshakeHead);

/**
 * @return {Buffer}
 */
S4Data.prototype.getBytes = function() {
  // 4: nKeepAliveSpace
  // 4: nReserved1
  // 4: nReserved2
  // 4: nDataLen
  var bytes = new Buffer(16);
  bytes.writeInt32LE(this.nKeepAliveSpace, 0);
  bytes.writeInt32LE(this.nReserved1, 4);
  bytes.writeInt32LE(this.nReserved2, 8);
  bytes.writeInt32LE(this.nDataLen, 12);

  return bytes;
}

/**
 * @param {Buffer} bytes
 * @return {S4Data}
 */
S4Data.createFromBytes = function(bytes) {
  var packet = new S4Data();
  packet.seed = new Buffer(bytes.slice(0, 16));
  packet.nKeepAliveSpace = bytes.readInt32LE(16);
  packet.nReserved1 = bytes.readInt32LE(20);
  packet.nReserved2 = bytes.readInt32LE(24);
  packet.nDataLen = bytes.readInt32LE(28);

  return packet;
}

/**
 * @type {int} ctFlag
 * @type {int} nSrcDataLen
 * @type {int} nZipDataLen
 * @type {int} nDestDataLen
 */
function PacketHead(ctFlag, nSrcDataLen, nZipDataLen, nDestDataLen) {
  /** 协议版本，当前版本为 #BIN_PRO_VER_1_0 **/
  // this.nVer = [0, 0, 1, 0];
  this.nVer = '\x00\x00\x01\x00';

  /** 标记，参考 #CT_TAG **/
  this.nTag = ProtocolConstant.CT_TAG;

  /**
   * 是否加密,0--不加密;1--加密
   * @type {int}
   */
  this.bEncrypt = 1;

  /**
   * 是否压缩算法,0--不压缩;1--压缩
   * @type {int}
   */
  this.bCompress = 1;

  /**
   * 客户端告诉服务器是否应该发送心跳，服务器表示一个心跳包
   * @type {int}
   **/
  this.bHeartBeat = 1;

  /**
   * 保留使用
   * @type {int}
   **/
  this.nReserved26 = 26;

  /**
   * 发送标志, 参考 #ECtSendFlags
   * @type {int}
   **/
  this.nSendFlag = ECtSendFlags.CT_SEND_FLAG_LOGIN;

  /**
   * 协议种类，暂为0
   * @type {int}
   */
  this.nCategory = 0;

  /**
   * 保留字段 
   * @type {int}
   */
  this.nReserved1 = 0;

  /**
   * 保留字段
   * @type {int}
   */
  this.nReserved2 = 0;

  /** 会话状态标示，参考 #ECtFlagConnectStates **/
  this.ctFlag = ctFlag;

  /** 原始数据长度 **/
  this.nSrcDataLen = nSrcDataLen;

  /** 压缩后数据长度 **/
  this.nZipDataLen = nZipDataLen;

  /** 加密后数据长度 **/
  this.nDestDataLen = nDestDataLen;
}
PacketHead.S1 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S1, 0, 0, 0);
PacketHead.S2 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S2, 0, 0, 0);
PacketHead.S3 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S3, 0, 0, 0);
PacketHead.S4 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S4, 0, 0, 0);
PacketHead.MESSAGE = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_OK, 0, 0, 0);
PacketHead.HEARTBEAT = new PacketHead(ECtFlagConnectStates.CT_FLAG_KEEPALIVE, 0, 0, 0);

/**
 * @return {Buffer}
 */
PacketHead.prototype.getBytes = function() {
  // 4: nVer
  // 4: nTag
  // 4: ctFlag
  // 4: nSrcDataLen
  // 4: nZipDataLen
  // 4: nDestDataLen
  // 4: 0
  // 4: nCategory
  // 4: nReserved1
  // 4: nReserved2

  // PacketHead Size is 40 bytes.
  var bytes = new Buffer(ProtocolConstant.PACKET_HEAD_LENGTH);
  bytes.fill(0);
  bytes.write(this.nVer, 0, Buffer.byteLength(this.nVer));
  bytes.write(this.nTag, 4, Buffer.byteLength(this.nTag));
  bytes.writeInt32LE(this.ctFlag, 8);
  bytes.writeInt32LE(this.nSrcDataLen, 12);
  bytes.writeInt32LE(this.nZipDataLen, 16);
  bytes.writeInt32LE(this.nDestDataLen, 20);
  bytes.writeInt32LE(0, 24);
  bytes.writeInt32LE(this.nCategory, 28);
  bytes.writeInt32LE(this.nReserved1, 32);
  bytes.writeInt32LE(this.nReserved2, 36);

  return bytes;
}

PacketHead.prototype.toString = function() {
  return HandshakeHead.prototype.toString.call(this);
}

/**
 * @type {Buffer} bytes
 */
PacketHead.createFromBytes = function(bytes) {
  var head = new PacketHead();
  head.nVer = bytes.toString('ascii', 0, 4);
  head.nTag = bytes.toString('ascii', 4, 8);
  head.ctFlag = bytes.readInt32LE(8);
  head.nSrcDataLen = bytes.readInt32LE(12);
  head.nZipDataLen = bytes.readInt32LE(16);
  head.nDestDataLen = bytes.readInt32LE(20);
  head.nSendFlag = bytes.readInt32LE(24);
  head.nCategory = bytes.readInt32LE(28);
  head.nReserved1 = bytes.readInt32LE(32);
  head.nReserved2 = bytes.readInt32LE(36);

  return head;
}

/**
 * @param {Buffer=} opt_data
 */
function Message(opt_data) {
  this.data = opt_data;

  /**
   * @type {string}
   */
  this.message;
}
Message.prototype.getBytes = function() {
  if (this.message) {
    return new Buffer(this.message, 'utf-8');
  }
  return this.data;
}

/**
 * @type {PacketHead=} opt_packetHead
 * @type {HandshakeHead=} opt_handshakeHead
 * @type {HandshakeBody=} opt_handshakeBody
 */
function Packet(opt_packetHead, opt_handshakeHead, opt_handshakeBody) {
  this.packetHead = opt_packetHead;
  this.handshakeHead = opt_handshakeHead;
  this.handshakeBody = opt_handshakeBody;

  /**
   * @type {Message}
   */
  this.message;
}
Packet.keepAlive = new Packet(PacketHead.HEARTBEAT, null, null);

/**
 * @return {?Buffer}
 */
Packet.prototype.getBytes = function() {
  var result;
  var ctFlag = this.packetHead.ctFlag;
  logger.debug('ctFlag = [' + ctFlag + ']');
  switch (ctFlag) {
    case ECtFlagConnectStates.CT_FLAG_CON_S1:
      result = utils.sumArray(this.packetHead.getBytes(),
        this.handshakeHead.getBytes());
      break;
    case ECtFlagConnectStates.CT_FLAG_CON_S2:
      break;
    case ECtFlagConnectStates.CT_FLAG_CON_S3:
      result = utils.sumArray(this.packetHead.getBytes(),
        this.handshakeHead.getBytes());
      if (this.handshakeBody == null) {
        return null;
      }
      result = utils.sumArray(result, this.handshakeBody.keyData);
      break;
    case ECtFlagConnectStates.CT_FLAG_CON_S4:
      break;
    case ECtFlagConnectStates.CT_FLAG_CON_OK:
      result = utils.sumArray(this.packetHead.getBytes(),
        this.message.getBytes());
      break;
    case ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
    case ECtFlagConnectStates.CT_FLAG_KEEPALIVE_2:
      result = this.packetHead.getBytes();
      break;
    default:
      break;
  }

  return result;
}

function PacketFactory() {
}
base.addSingletonGetter(PacketFactory);

/**
 * @type {PacketHead} head
 * @type {Buffer} bytes
 * @type {function(Packet)} callback
 */
PacketFactory.prototype.create = function(head, bytes, callback) {
  switch(head.ctFlag) {
    case ECtFlagConnectStates.CT_FLAG_CON_S2: {
      // Modifying the new buffer slice will modify memory in the original buffer!
      var s2Data = S2Data.createFromBytes(bytes.slice(0, 18));
      logger.debug(s2Data);

      var hb = new HandshakeBody();
      hb.keyData = bytes.slice(18, 18 + s2Data.nDataLen);

      callback(null, new Packet(head, s2Data, hb));
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_CON_S4: {
      var s4Data = S4Data.createFromBytes(bytes.slice(0, 32));

      var hbs4 = new HandshakeBody();
      hbs4.keyData = bytes.slice(32, 32 + s4Data.nDataLen);

      var packet = new Packet(head, s4Data, hbs4);

      var xmlLength = head.nSrcDataLen - 32 - s4Data.nDataLen;
      var start = 32 + s4Data.nDataLen;
      var end = start + xmlLength;
      var xml = bytes.slice(start, end);

      // <ts_config><heartbeat sign_interval="300" echo_timeout="600"/></ts_config>
      packet.message = new Message(xml);

      callback(null, packet);
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
    case ECtFlagConnectStates.CT_FLAG_KEEPALIVE_2: {
      logger.debug('get message CT_FLAG_KEEPALIVE');

      var dataOK = bytes.slice(0, head.nDestDataLen);
      var decryptedData = security.AESDecrypt(dataOK, head.nSrcDataLen);
      if (!decryptedData) {
        callback('invalid CT_FLAG_KEEPALIVE packet, decrypt failed!');
        break;
      }

      var packet = new Packet(head);
      packet.message = new Message(decryptedData);

      callback(null, packet);
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_CON_OK: {
      logger.debug('get message CT_FLAG_CON_OK');

      var dataOK = bytes.slice(0, head.nDestDataLen);
      var decryptedData = security.AESDecrypt(dataOK, head.nZipDataLen);
      if (!decryptedData) {
        callback('invalid CT_FLAG_CON_OK packet, decrypt failed!');
        break;
      }

      security.decompressData(decryptedData, head.nSrcDataLen, function(err, decompressData){
        if (err) {
          callback('invalid CT_FLAG_CON_OK packet, decompress failed!');
          return;
        }

        var packet = new Packet(head);
        packet.message = new Message(decompressData);
        callback(null, packet);
      });
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES: {
      logger.debug('get message CT_FLAG_CON_OK_DOZIP_NOAES');

      var dataOK = bytes.slice(0, head.nDestDataLen);
      security.decompressData(dataOK, head.nZipDataLen, function(err, decompressData){
        if (err) {
          logger.warn(dataOK.toString('base64'));
          callback('invalid CT_FLAG_CON_OK_DOZIP_NOAES packet, decompress failed!');
          return;
        }

        var packet = new Packet(head);
        packet.message = new Message(decompressData);

        callback(null, packet);
      });
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES: {
      logger.debug('get message CT_FLAG_CON_OK_NOZIP_DOAES');
      var dataOK = bytes.slice(0, head.nDestDataLen);
      logger.debug(dataOK.toString('base64'));
      var decryptedData = security.AESDecrypt(dataOK, head.nSrcDataLen);
      if (!decryptedData) {
        callback('invalid CT_FLAG_CON_OK_NOZIP_NOAES packet, decrypt failed!');
        break;
      }
      logger.debug(JSON.stringify(decryptedData.toString('ascii')));

      var packet = new Packet(head);
      packet.message = new Message(decryptedData);

      callback(null, packet);
      break;
    }

    case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
      logger.debug('get message CT_FLAG_CON_OK_NOZIP_NOAES');

      var dataOK = byte.slice(0, head.nDestDataLen);

      var packet = new Packet(head);
      packet.message = new Message(dataOK);

      callback(null, packet);
      break;
    }

    default:
      logger.error(head);
      callback('Invalid ctFlag = [' + head.ctFlag + ']');
      break;
  }
}

exports.HandshakeHead = HandshakeHead;
exports.HandshakeBody = HandshakeBody;
exports.S1Data = S1Data;
exports.S2Data = S2Data;
exports.S3Data = S3Data;
exports.S4Data = S4Data;
exports.PacketHead = PacketHead;
exports.Message = Message;
exports.Packet = Packet;
exports.PacketFactory = PacketFactory;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
