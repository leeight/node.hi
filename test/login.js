var net = require('net')
var socket = net.createConnection(1863, "m3.im.baidu.com");
socket.on('error', function (error) {
    console.log(error);
});
socket.on('data', function (d) {
    console.log('receiving data');
    console.log(d);
    console.log(d.length);
});
socket.on('connect', function (connect) {
    console.log('connection established');
    // packethead.s1 + s1data = (可以用来验证结果哦)
    var buf = new Buffer([0, 0, 1, 0, 49, 86, 77, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    socket.write(buf);
});
socket.on('end', function () {
    console.log('socket closing...');
});
socket.setKeepAlive(true, 1000);
