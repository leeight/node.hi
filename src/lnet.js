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
var events = require('events');
var base = require('./base');
var protocol = require('./protocol');
var constant = require('./constant');
var security = require('./security');
var utils = require('./utils');
var logger = require('./logger').logger;
var response = require('./response');

/**
 * @param {Socket} socket
 */
function NetManager(socket) {
  this.socket = socket;

  /**
   * 是否处于握手阶段
   * @type {boolean}
   */
  this.IS_HAND_SHAKE = false;

  /**
   * 是否握手成功
   * @type {boolean}
   */
  this.IS_HAND_SHAKE_OK = false;

  /**
   * S2阶段获取到的HAND_SHAKE_KEY
   */
  this.HAND_SHAKE_KEY;

  this.socket.on('data', this.onData.bind(this));

  this.sendedCommand = {};

  /**
   * key => protocolType
   * val => class | function | string
   * @type {Object.<string, ??>}
   */
  this._messageHandlers = {};
}
base.inherits(NetManager, events.EventEmitter);
NetManager.messageId = 1;

/**
 * @return {int}
 */
NetManager.getNextId = function() {
  return NetManager.messageId ++;
}

NetManager.prototype.onData = function(bytes) {
  logger.debug('receiving data');
  logger.debug(bytes);

  var packet = this.decode(bytes);

  switch(packet.packetHead.ctFlag) {
    case constant.ECtFlagConnectStates.CT_FLAG_CON_S2: {
      logger.debug('Received HandshakeS2');
      var s2 = packet.handshakeHead;
      var keyNo = s2.nRootKeyNO;
      var byteKey = constant.IM_RootPubKeyData_PEM[keyNo];
      this.HAND_SHAKE_KEY = security.decodeDataToKey(packet.handshakeBody.keyData,
        security.publicKey(byteKey));
      this.sendHandshakeS3();
      break;
    }
    case constant.ECtFlagConnectStates.CT_FLAG_CON_S4: {
      logger.debug('Received HandshakeS4');
      var s4 = packet.handshakeHead;
      security.setMd5Seed(s4.seed);

      var s4body = packet.handshakeBody;
      var encryptedAESKey = s4body.keyData;
      security.setAesKey(this.S3_KEYPAIR.decrypt(encryptedAESKey, undefined, undefined, 1));
      this.finishHandshake();
      break;
    }
    case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE: {
      // TODO(leeight)
      break;
    }
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK:
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES:
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES:
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
      this.dispatchMessage(packet.message);
      break;
    }
    default: {
      logger.error('Invalid packet');
      break;
    }
  }
}

/**
 * 注册消息的处理函数.
 */
NetManager.prototype._registerMessageHandlers = function() {
  this._messageHandlers['security_verify'] = 'VerifyResponse';
  this._messageHandlers['login_login'] = 'LoginResponse';
  this._messageHandlers['login_kickout'] = 'KickoutResponse';
  this._messageHandlers['user_login_ready'] = 'LoginReadyResponse';
  this._messageHandlers['friend_get_friend'] = 'FriendGetFriendResponse';
  this._messageHandlers['friend_get_block'] = 'FriendGetBlockResponse';
  this._messageHandlers['friend_get_team'] = 'FriendGetTeamResponse';
  this._messageHandlers['friend_add'] = 'FriendAddResponse';
  this._messageHandlers['friend_add_ack'] = 'FriendAddAckResponse';
  this._messageHandlers['friend_friend_change'] = 'FriendChangeResponse';
  this._messageHandlers['user_query'] = 'UserQueryReponse';
  this._messageHandlers['query_offline_msg_count'] = 'OfflineMsgCountResponse';
  this._messageHandlers['query_get_offline_msg'] = 'OfflineMsgResponse';
  this._messageHandlers['user_set'] = 'UserSetResponse';
  this._messageHandlers['friend_set'] = 'FriendInfoUpdateResponse';
  this._messageHandlers['contact_notify'] = 'ContactNotifyResponse';
  this._messageHandlers['contact_query'] = 'ContactQueryResponse';
  this._messageHandlers['timestamp_user'] = 'TimestampResponse';

  // TODO...
}

/**
 * @param {Message} msg
 */
NetManager.prototype.dispatchMessage = function(msg) {
  var res = response.BaseResponse.createResponse(msg.data);
  if (res.code === constant.StausCode.SERVER_ERROR ||
      res.code === constant.StausCode.IM_UNKNOWN) {
    logger.error('invalid res.code = [' + res.code + ']');
    return;
  }

  var protocolType = (res.superCommand + '_' + res.command).toLowerCase();
  if (this._messageHandlers[protocolType]) {
    var klassName = this._messageHandlers[protocolType];
    var ctor = response[klassName];
    var instance = new ctor(res);

    // dispatch instance to receivers
  }
}

NetManager.prototype.startHandshake = function() {
  this.IS_HAND_SHAKE = true;
  this.sendHandshakeS1();
}

NetManager.prototype.sendHandshakeS1 = function() {
  var handshakeHeadS1 = new protocol.S1Data();
  var s1DataByte = handshakeHeadS1.getBytes();

  var packetHeadS1 = protocol.PacketHead.S1;
  packetHeadS1.nDestDataLen = s1DataByte.length;
  packetHeadS1.nSrcDataLen = s1DataByte.length;
  packetHeadS1.nZipDataLen = s1DataByte.length;

  var handshakeS1 = new protocol.Packet(packetHeadS1, handshakeHeadS1, null);
  this.send(handshakeS1);
}

NetManager.prototype.sendHandshakeS3 = function() {
  var pair = security.getKeyPair();

  this.S3_PUBKEY_BYTE = pair[0];
  this.S3_PRIKEY_BYTE = pair[1];
  this.S3_KEYPAIR = pair[2];

  // 默认的RSA_PKCS1_OAEP_PADDING是有问题的, 需要使用RSA_PKCS1_PADDING
  var k1 = this.HAND_SHAKE_KEY.encrypt(new Buffer(this.S3_PUBKEY_BYTE.slice(0, 100)),
           undefined, undefined, 1);
  var k2 = this.HAND_SHAKE_KEY.encrypt(new Buffer(this.S3_PUBKEY_BYTE.slice(100, 140)),
           undefined, undefined, 1);

  var key = utils.sumArray(k1, k2);
  var handshakeBodyS3 = new protocol.HandshakeBody();
  handshakeBodyS3.keyData = key;

  var handshakeHeadS3 = new protocol.S3Data();
  handshakeHeadS3.nDataLen = handshakeBodyS3.keyData.length;
  handshakeHeadS3.nReserved1 = 0;
  handshakeHeadS3.nReserved2 = 0;

  var packetHeadS3 = protocol.PacketHead.S3;
  var s3DataByte = handshakeHeadS3.getBytes();
  packetHeadS3.nSendFlag = constant.ECtSendFlags.CT_SEND_FLAG_HANDSHAKE;
  packetHeadS3.nDestDataLen = s3DataByte.length + handshakeBodyS3.getLength();
  packetHeadS3.nSrcDataLen = s3DataByte.length + handshakeBodyS3.getLength();
  packetHeadS3.nZipDataLen = s3DataByte.length + handshakeBodyS3.getLength();

  var handshakeS3 = new protocol.Packet(packetHeadS3, handshakeHeadS3, handshakeBodyS3);
  this.send(handshakeS3);
}

/**
 * 握手成功.
 */
NetManager.prototype.finishHandshake = function() {
  this.IS_HAND_SHAKE = false;
  this.IS_HAND_SHAKE_OK = true;
  this._registerMessageHandlers();
  this.emit('finish_handshake');
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
 * @param {Packet} packet
 */
NetManager.prototype.send = function(packet) {
  logger.debug('NetManager.prototype.send');
  if (this.IS_HAND_SHAKE) {
    this.socket.write(packet.getBytes());
  } else {
    var head = packet.packetHead;
    if (head.ctFlag === constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE) {
      this.socket.write(head.getBytes());
    } else {
      var msg = packet.message;
      var msgBytes = msg.getBytes();
      var me = this;
      security.compressData(msgBytes, function(zipBytes){
        var aesBytes = security.AESEncrypt(zipBytes);
        head.nSrcDataLen = msgBytes.length;
        head.nZipDataLen = zipBytes.length;
        head.nDestDataLen = aesBytes.length;
        logger.debug(head.getBytes());
        logger.debug(aesBytes);
        var data = utils.sumArray(head.getBytes(), aesBytes);
        logger.debug(data);
        me.socket.write(data);
      });
    }
  }
}

/**
 * @param {BaseCommand} command
 */
NetManager.prototype.sendMessage = function(command) {
  var packet = new protocol.Packet();
  packet.packetHead = protocol.PacketHead.MESSAGE;
  var msg = command.createCommand();
  logger.debug(JSON.stringify(msg));
  packet.message = new protocol.Message(new Buffer(msg, 'utf-8'));
  this.send(packet);
  this.cacheCommand(command);
  return command.seq;
}

/**
 * @param {Buffer} bytes
 * @return {Packet}
 */
NetManager.prototype.decode = function(bytes) {
  var head = protocol.PacketHead.createFromBytes(bytes);
  switch(head.ctFlag) {
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK:
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES:
      length = head.nDestDataLen;
      break;
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES:
      length = head.nZipDataLen;
      break;
    default:
      length = head.nSrcDataLen;
      break;
  }
  logger.debug(head);

  var packet = protocol.PacketFactory.getInstance().create(head,
      bytes.slice(constant.ProtocolConstant.PAKECT_HEAD_LENGTH));
  if (!packet) {
    logger.error('invalid packet :-(');
    return;
  }

  logger.debug(packet);

  return packet;
}

/**
 * @param {Packet} packet
 * @return {Buffer}
 */
NetManager.prototype.encode = function(packet) {
}

exports.NetManager = NetManager;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
