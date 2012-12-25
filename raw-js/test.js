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

/*
var asn1 = require('./asn1');
// var der = 'MIGJAoGBALeOGqvBvEC0Ta2ZYm998FXxPKZNh/krDjFYVH6iT6oOzJgTPo/rvTC9RuUsgmpgi5dtQi/1ZiXjp7Fl4qsEkx4fVL3W9DK+jgnam2vw5GtrpECrQjV022UkJRu4AWajWE91H/b4V9WU7FI15T+j+Q5jmxeAWSTQKRW5xoreRN1lAgMBAAE=';
var der = [48,129,137,2,129,129,0,183,142,26,171,193,188,64,180,77,173,153,98,111,125,240,85,241,60,166,77,135,249,43,14,49,88,84,126,162,79,170,14,204,152,19,62,143,235,189,48,189,70,229,44,130,106,96,139,151,109,66,47,245,102,37,227,167,177,101,226,171,4,147,30,31,84,189,214,244,50,190,142,9,218,155,107,240,228,107,107,164,64,171,66,53,116,219,101,36,37,27,184,1,102,163,88,79,117,31,246,248,87,213,148,236,82,53,229,63,163,249,14,99,155,23,128,89,36,208,41,21,185,198,138,222,68,221,101,2,3,1,0,1];
var pbk = asn1.ASN1.decode(der).toHexDOM();
console.log(pbk);
*/

/*
var pem = [
'-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTax1kRYFi6oM0piwathvPXsYI',
'vyZNTVoWxQfYB3PTCzkZj9wTgiUvZKJ80//g5NYXWX9NCRoGXriRqFyvT19wiCkC',
'kUER6YuXtb5jgq5hzeVTDsRjuHfs5yQxGzRzg2UeB87EnaUPUhjEse62iSXnRCG6',
'9CD+g4J1oIgO0dZlHQIDAQAB',
'-----END PUBLIC KEY-----'
].join('\n');

var ursa = require('ursa');
var pubkey = ursa.createPublicKey(pem);
console.log(pubkey);
console.log(pubkey.getExponent());
console.log(pubkey.getModulus());
process.exit(0);
*/


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
        var byteKey = constant.IM_RootPubKeyData_PEM[keyNo];
        console.log(packet.handshakeBody.keyData.length);
        var handshakeKey = security.decodeDataToKey(packet.handshakeBody.keyData,
          security.publicKey(byteKey));
        console.log(handshakeKey);
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
