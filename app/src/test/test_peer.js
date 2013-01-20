/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/test/test_peer.js ~ 2013/01/20 12:28:02
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
require(['../channel', '../debug'], function(channel, debug){

var clientChannel = new channel.ClientChannel(window.opener);
clientChannel.on('ping', function(data){
  debug.log('Receive ping_ack from peer window [' + data.__peer_id__ + '].');
  document.title += (" " + clientChannel.getId());
  $("#say-hello-world").click(function(){
    clientChannel.emit('hello_world');
  });
});
clientChannel.ping();
debug.log('Sent ping packet.');

});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
