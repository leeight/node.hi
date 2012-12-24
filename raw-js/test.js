/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test.js ~ 2012/12/23 11:58:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var net = require('net')
var protocol = require('./protocol');
var constant = require('./constant');
var security = require('./security');

/**
 * 是否出于握手阶段
 */
var isHandshake = false;
function sendHandshakeS1(socket) {
  var handshakeHeadS1 = new protocol.S1Data();
  var s1DataByte = handshakeHeadS1.getBytes();

  var packetHeadS1 = protocol.PacketHead.S1;
  packetHeadS1.nDestDataLen = s1DataByte.length;
  packetHeadS1.nSrcDataLen = s1DataByte.length;
  packetHeadS1.nZipDataLen = s1DataByte.length;

  var handshakeS1 = new protocol.Packet(packetHeadS1, handshakeHeadS1, null);
  var bytes = handshakeS1.getBytes();

  socket.write(bytes);
}

function sendHandshakeS3(socket, handshakeKey) {
}

var socket = net.createConnection(1863, "m3.im.baidu.com");
socket.on('error', function (error) {
    console.log(error);
});
socket.on('data', function (d) {
    console.log('receiving data');
    debugger;
    var head = protocol.PacketHead.createFromBytes(d);
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
    console.log(head);

    var packet = protocol.PacketFactory.getInstance().create(head,
        d.slice(constant.ProtocolConstant.PAKECT_HEAD_LENGTH));
    console.log(packet);
    switch(packet.packetHead.ctFlag) {
      case constant.ECtFlagConnectStates.CT_FLAG_CON_S2: {
        console.log('Received HandshakeS2');
        var s2 = packet.handshakeHead;
        var keyNo = s2.nRootKeyNO;
        var byteKey = constant.ProtocolConstant.IM_RootPubKeyData[keyNo];
        var handshakeKey = security.decodeDataToKey(packet.handshakeBody.keyData,
          security.publicKey(byteKey));
        // sendHandshakeS3(this, handshakeKey);
        break;
      }
      case constant.ECtFlagConnectStates.CT_FLAG_CON_S4: {
        break;
      }
      case constant.ECtFlagConnectStates.CT_FLAG_KEEPALIVE: {
        break;
      }
      case constant.ECtFlagConnectStates.CT_FLAG_CON_OK:
      case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES:
      case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES:
      case constant.ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
        break;
      }
      default: {
        console.error('Invalid packet');
        break;
      }
    }
    // console.log(d);
    // console.log(d.length);
});
socket.on('connect', function (connect) {
    console.log('connection established');
    isHandshake = true;
    sendHandshakeS1(this);
});
socket.on('end', function () {
    console.log('socket closing...');
});
socket.setKeepAlive(true, 1000);




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
