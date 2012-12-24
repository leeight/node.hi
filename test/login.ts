import net = module('net');

import ns = module('../protocol');
var S1Data = ns.protocol.S1Data;
var PacketHead = ns.protocol.PacketHead;
var Packet = ns.protocol.Packet;

function sendHandshakeS1() {
  var handshakeHeadS1 = new S1Data();
  var s1DataByte = handshakeHeadS1.getBytes();
  return s1DataByte;
  console.log(s1DataByte);

  var packetHeadS1 = PacketHead.S1;
  packetHeadS1.nDestDataLen = s1DataByte.length;
  packetHeadS1.nSrcDataLen = s1DataByte.length;
  packetHeadS1.nZipDataLen = s1DataByte.length;

  var handshakeS1 = new Packet(packetHeadS1, handshakeHeadS1, null);
}
var socket = net.createConnection(1863, "m3.im.baidu.com");
socket.on('error',  function(error){
  console.log(error);
});
socket.on('data', function(d){
  console.log(d);
});
socket.on('connect', function(connect){
  console.log('connection established');
  socket.write(sendHandshakeS1());
});
socket.on('end', function(){
  console.log('socket closing...');
});
socket.setKeepAlive(true, 1000);
