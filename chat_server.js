/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * chat_server.js ~ 2012/12/30 21:20:10
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var hi = require('./lib/client');
var io = require('socket.io').listen(8888);
var moment = require('moment');

var client = new hi.Client();
client.setUser('linuxracer', 'zhenxi');

function getTime(opt_time) {
  var time = opt_time || Date.now();
  return moment(parseInt(time, 10)).format("YYYY/MM/DD hh:mm:ss")
}

io.sockets.on('connection', function (socket) {
  /*
  socket.emit('new_message', {
    'content': 'welcome',
    'time': getTime()
  });
  socket.emit('new_message', {
    'content': 'welcome',
    'time': getTime()
  });
  setInterval(function(){
    socket.emit('new_message', {
      'source_type': (Math.random() > 0.5 ? 'incoming' : 'outcoming'),
      'content': 'welcome',
      'time': getTime()
    });
  }, 1000);
  */
  client.on('login_success', function(){
    socket.emit('new_message', {
      "source_type": "incoming",
      "content": "登陆成功, imid = [" + this.user.imid + "]",
      "time": "3分钟前"
    });
  });
  client.on('new_message', function(response){
    var text = require('./lib/utils').xml2text(response.xml);
    socket.emit('new_message', {
      "source_type": "incoming",
      "content": text,
      "time": getTime(response.time)
    });
  });
  client.start();
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
