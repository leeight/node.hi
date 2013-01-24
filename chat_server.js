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


function getTime(opt_time) {
  var time = opt_time || Date.now();
  return moment(parseInt(time, 10)).format("YYYY/MM/DD hh:mm:ss")
}

io.sockets.on('connection', function (socket) {
  var client = new hi.Client();

  // --- Packaged App ---
  // Packaged App操作, 开始登陆.
  socket.on('login', function(account){
    client.setUser(account.username, account.password);
    client.start();
  });

  // Packaged App操作, 发送消息.
  socket.on('send_message', function(msg){
    client.sendMessage(msg.to_id, msg.text);
  });

  // --- Baidu Hi Client ---
  client.on('login_success', function(){
    socket.emit('login_success', {
      "source_type": "incoming",
      "content": "登陆成功, imid = [" + this.user.imid + "]",
      "from_id": 0,
      "time": getTime()
    });
  });

  client.on('contact_notify', function(friend){
    socket.emit('contact_notify', friend);
  });

  client.on('after_user_query', function(){
    socket.emit('after_user_query', {
      'imid': this.user.imid,
      'personal_comment': this.user.personal_comment,
      'nickname': this.user.nickname,
      'name': this.user.name,
      'account': this.user.account,
      'avatar': this.user.avatar
    });
  });

  client.on('friend_list', function(friends){
    socket.emit('friend_list', friends);
  });

  client.on('new_message', function(response){
    var text = require('./lib/utils').xml2text(response.xml);
    socket.emit('new_message', {
      "source_type": "incoming",
      "content": text,
      "from_id": response.from_id,
      "time": getTime(response.time)
    });
  });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
