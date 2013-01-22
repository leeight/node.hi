/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/test/test_channel.js ~ 2013/01/20 12:27:06
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

require(['../channel', '../debug', '../ui/ui'], function(channel, debug, ui){

var count = 0;

function launchChatWindow() {
  ui.createChatWindow('test_peer.html?id=' + (count ++), function(peerWindow){
    var clientChannel = new channel.ClientChannel(peerWindow);
    clientChannel.on('ping', function(data){
      debug.log('Receive ping from peer window [' + data.__peer_id__ + '], i\'ll ping back soon.');
      clientChannel.ping();
      debug.log("Sent ping ack packet.");
    });
    clientChannel.on('hello_world', function(data){
      debug.log('Receive hello world from peer window [' + data.__peer_id__ + ']');
    });
    clientChannel.on('close', function(data){
      debug.log('Channel was closed [' + data.__peer_id__ + '].');
    })
  });
  return false;
}
$("#launch-chat-window").click(launchChatWindow);

});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
