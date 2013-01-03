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
var logger = require('./logger').getLogger(__filename);
var response = require('./response/all');
var logic = require('./logic/all');

/**
 * @param {Socket} socket
 * @param {Client} client
 */
function NetManager(socket, client) {
  events.EventEmitter.call(this);

  this.socket = socket;

  this._client = client;

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

  this.sendedCommand = {};

  /**
   * key => protocolType
   * val => class | function | string
   * @type {Object.<string, ??>}
   */
  this._messageHandlers = {};

  /**
   * Business logic instances
   * @type {Array.<Object>}
   */
  this._receivers = [];

  this._bytes;

  this.socket.on('data', this._onSocketData.bind(this));
  this.socket.on('close', this._onSocketClose.bind(this));
  this.socket.on('error', this._onSocketError.bind(this));

  this.on('new_packet', this.onNewPacket.bind(this));
}
base.inherits(NetManager, events.EventEmitter);
NetManager.messageId = 1;

/**
 * @return {int}
 */
NetManager.getNextId = function() {
  return NetManager.messageId ++;
}

NetManager.prototype.getClient = function() {
  return this._client;
}

NetManager.prototype._onSocketClose = function() {
  logger.warn('the server closed this socket');
}

NetManager.prototype._onSocketError = function() {
  logger.error('socket error');
}

NetManager.prototype._onSocketData = function(bytes) {
  logger.debug('NetManager.prototype._onSocketData');
  if (this._bytes && this._bytes.length > 0) {
    this._bytes = Buffer.concat(
      [this._bytes, bytes],
      this._bytes.length + bytes.length);
  } else {
    this._bytes = bytes;
  }

  logger.debug('receiving data, length = [' + this._bytes.length + ']');
  logger.debug(utils.dumpBuffer(this._bytes));

  this.decode();
}

/**
 * 从Buffer里面解析出新的Packet之后的回调函数, 因为decode数据
 * 可能是异步的哦, 亲...
 */
NetManager.prototype.onNewPacket = function(packet) {
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

      // <ts_config><heartbeat sign_interval="300" echo_timeout="600"/></ts_config>
      // var DOMParser = require('xmldom').DOMParser;
      // var doc = new DOMParser().parseFromString(packet.message.message);
      // var ts_config = doc.documentElement;

      this.finishHandshake();
      break;
    }
    case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
    case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE_2: {
      // TODO(leeight)
      logger.debug('Get keep alive packet from server.');
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

NetManager.prototype._startKeepAlive = function() {
  // 好像固定是30s, 那么就忽略服务器返回的内容得了
  // <ts_config><heartbeat sign_interval="300" echo_timeout="600"/></ts_config>
  var me = this;
  setInterval(function(){
    logger.debug('NetManager.prototype._startKeepAlive');
    me.send(protocol.Packet.keepAlive);
  }, 30 * 1000);
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
  this._messageHandlers['msg_msg_notify'] = 'MsgNotifyResponse';
  this._messageHandlers['cm_blk'] = 'CmBlkResponse';
  this._messageHandlers['msg_msg_ack'] = 'DummyResponse';
  this._messageHandlers['msg_msg_ack_notify'] = 'MsgAckNotifyResponse';

  // 用来提示对方正在打字...
  this._messageHandlers['cm_typ'] = 'DummyResponse';

  // TODO(leeight) 处理其它类型的Packet.

  this._receivers = logic.all();
}

/**
 * @param {Message} msg
 */
NetManager.prototype.dispatchMessage = function(msg) {
  if (!msg.data) {
    logger.error('invalid message, msg.data is undefined');
    return;
  }

  var res = response.BaseResponse.createResponse(msg.data);
  if (res.code === constant.StatusCode.SERVER_ERROR ||
      res.code === constant.StatusCode.IM_UNKNOWN) {
    logger.error('invalid res.code = [' + res.code + ']');
    return;
  }

  var protocolType = (res.superCommand + '_' + res.command).toLowerCase();

  logger.debug('protocolType = [' + protocolType + ']');

  if (this._messageHandlers[protocolType]) {
    var klassName = this._messageHandlers[protocolType];
    var ctor = response[klassName];
    if (ctor) {
      var instance = new ctor(res);
      if (!instance.is_dummy) {
        var me = this;
        this._receivers.forEach(function(receiver, index){
          try {
            receiver.emit('message', instance, me);
          } catch(e) {
            logger.error('receiver[' + index + '] process message failed, err = [' + e + ']');
          }
        });
      }
    } else {
      logger.warn('response.' + klassName + ' is undefined');
    }
  } else {
    logger.warn('NetManager._messageHandlers[' + protocolType + '] is undefined.');
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
  this.getClient().emit('finish_handshake');
  this._startKeepAlive();
}

NetManager.prototype.findCommand = function(seq) {
  return this.sendedCommand[seq];
}

NetManager.prototype.cacheCommand = function(command) {
  // FIXME(leeight) 注意在合适的地方删掉这些缓存的command
  this.sendedCommand[command.seq] = command;
}

NetManager.prototype.removeCommand = function(seq) {
  if (this.sendedCommand[seq]) {
    delete this.sendedCommand[seq];
  }
}

NetManager.prototype._sendImpl = function(bytes) {
  logger.debug('NetManager.prototype._sendImpl, bytes.length = [' + bytes.length + ']');
  logger.debug(utils.dumpBuffer(bytes));
  this.socket.write(bytes);
}

/**
 * @param {Packet} packet
 */
NetManager.prototype.send = function(packet) {
  logger.debug('NetManager.prototype.send');
  if (this.IS_HAND_SHAKE) {
    this._sendImpl(packet.getBytes());
  } else {
    var head = packet.packetHead;
    if (head.ctFlag === constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE ||
        head.ctFlag === constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE_2) {
      this._sendImpl(head.getBytes());
    } else {
      var msg = packet.message;
      var msgBytes = msg.getBytes();
      var me = this;
      security.compressData(msgBytes, function(zipBytes){
        var aesBytes = security.AESEncrypt(zipBytes);
        head.nSrcDataLen = msgBytes.length;
        head.nZipDataLen = zipBytes.length;
        head.nDestDataLen = aesBytes.length;
        var data = utils.sumArray(head.getBytes(), aesBytes);
        me._sendImpl(data);
      });
    }
  }
}

/**
 * @param {BaseCommand} command
 */
NetManager.prototype.sendMessage = function(command) {
  logger.debug('NetManager.prototype.sendMessage, command.protocolType = [' +
    command.protocolType + ']');

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
 * @return {Packet}
 */
NetManager.prototype.decode = function() {
  logger.debug('NetManager.prototype.decode');

  var bufferSize = this._bytes.length;
  var packetHeadLength = constant.ProtocolConstant.PACKET_HEAD_LENGTH;

  if (bufferSize < packetHeadLength) {
    // 太小了, 包头都不够
    logger.error('bufferSize = [' + bufferSize + '], packetHeadLength = [' +
      packetHeadLength + ']');
    return false;
  }

  var head = protocol.PacketHead.createFromBytes(this._bytes);
  logger.debug(head.toString());

  var length = 0;

  switch(head.ctFlag) {
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK:
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES:
    case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE_2:
    case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
      length = head.nDestDataLen;
      break;
    case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES:
      length = head.nZipDataLen;
      break;
    default:
      length = head.nSrcDataLen;
      break;
  }

  var packetSize = length + packetHeadLength;
  if (bufferSize < (packetSize)) {
    // 还是太小, 没有收到整个包
    logger.error('bufferSize = [' + bufferSize + '], length = [' + length +
      '], packetHeadLength = [' + packetHeadLength + ']')
    return false;
  }

  var buffer = new Buffer(this._bytes.slice(packetHeadLength, packetSize));
  this._bytes = this._bytes.slice(packetSize);

  var me = this;
  protocol.PacketFactory.getInstance().create(head, buffer, function(err, opt_packet){
      if (err) {
        logger.error('invalid packet :-(');
        logger.error(err);
      } else {
        me.emit('new_packet', opt_packet);
        if (me._bytes.length > 0) {
          // 有时候服务器是把多个packet一起发过来, 所以要递归的处理
          me.decode();
        }
      }
    });
}

/**
 * @param {Packet} packet
 * @return {Buffer}
 */
NetManager.prototype.encode = function(packet) {
}

exports.NetManager = NetManager;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
