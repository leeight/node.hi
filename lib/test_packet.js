/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_packet.js ~ 2013/01/01 13:58:34
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var protocol = require('./protocol');
var logger = require('./logger').logger;

exports.testPacketFactory = function(test) {
  var bytes = new Buffer([
    0x00, 0x00, 0x01, 0x00, 0x31, 0x56, 0x4d, 0x49,
    0x00, 0x00, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00,
    0x11, 0x00, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00
  ]);
  var head 

  var head = protocol.PacketHead.createFromBytes(bytes);
  logger.debug(head.toString());

  protocol.PacketFactory.getInstance().create(head,
    bytes.slice(40), function(err, opt_packet){
      if (err) {
        logger.error(err);
      } else {
        logger.debug(opt_packet.toString());
      }
      test.done();
    });
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
