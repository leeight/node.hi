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

ui.createChatWindow('test_peer.html', function(peerWindow){
  var clientChannel = new channel.ClientChannel(peerWindow);
  clientChannel.on('ping', function(pw){
    debug.log('Receive ping from peer window, i\'ll ping back soon.');
    clientChannel.ping();
    debug.log("Sent ping ack packet.");
  });
});

});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
