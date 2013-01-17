/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_native_hi.js ~ 2013/01/17 10:34:44
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 分析一下wireshark抓包的结果
 **/
var base = require('./base');
var model = require('./model');
var inet = require('./inet');
var constant = require('./constant');
var security = require('./security');
var protocol = require('./protocol');
var logger = require('./logger').getLogger(__filename);

// 220.181.5.99:443

logger.info('==== CLIENT -> SERVER ====');
// 1. DISPLAY_IMAGE_AUTH
// 2. imid = 0xffd30101
var c_2_s = new Buffer("0100020000100000ffd30101000000000000000000000000000000000000000000000000ffd30101", "hex");
var head = protocol.RequestHeader.createFromBytes(c_2_s);
logger.debug(head.toString());

logger.info('==== SERVER -> CLIENT ===');
// 1. DISPLAY_IMAGE_AUTH_RESP
// 2. imid = 0xffd30101
// 3. result = 0;
var s_2_c = new Buffer("0100028000100000ffd3010100000000000000000000000000000000000000000000000000000000", "hex");
var head = protocol.RequestHeader.createFromBytes(s_2_c);
logger.debug(head.toString());
// 还剩余4个字节，也就是token的长度
logger.debug('head.bytes = [%s], raw.bytes = [%s]', head.getBytes().length, s_2_c.length);
var packetHeadLength = constant.ProtocolConstant.REQUESTER_HEAD_LENGTH;
var length = 4;
var packetSize = packetHeadLength + length;
var buffer = s_2_c.slice(packetHeadLength, packetSize);
var packet = protocol.ImagePacketFactory.getInstance().create(head, null, buffer);
logger.debug(base.toString(packet));

logger.info('==== CLIENT -> SERVER ====');
// 1. QUERY_OTHER_IMAGE
var c_2_s = new Buffer("0100220000100000ffd30101000000000000000000000000000000000000000000000000a72f9c7027a5642e6feb1f80649df547000000002a9f020028000000e5ca5b02f925fd75", "hex");
var head = protocol.RequestHeader.createFromBytes(c_2_s);
logger.debug(head.toString());
var info = protocol.ImageRequest.createFromBytes(c_2_s.slice(constant.ProtocolConstant.REQUESTER_HEAD_LENGTH));
logger.debug(base.toString(info));


logger.info('==== SERVER -> CLIENT ====');
// 1. QUERY_OTHER_IMAGE_RESP
var s_2_c = new Buffer("0100228000100000ffd30101000000000000000000000000000000000000000000000000a72f9c7027a5642e6feb1f80649df54700000000000000002a9f0200000000000000000000000000", "hex");
var head = protocol.RequestHeader.createFromBytes(s_2_c);
logger.debug(head.toString());
var packetSize = packetHeadLength + 40;
var imageRes = protocol.ImageResponse.createFromBytes(s_2_c.slice(packetHeadLength, packetSize));
logger.debug(base.toString(imageRes));
var packet = protocol.ImagePacketFactory.getInstance().create(head, imageRes);
logger.debug(base.toString(packet));

logger.info('==== CLIENT -> SERVER ====');
// 1. UPLOAD_OTHER_IMAGE
var c_2_s = new Buffer("0100250000100000ffd30101000000000000000000000000000000000000000000000000a72f9c7027a5642e6feb1f80649df547000000002a9f0200000000000000000000000000", "hex");
var head = protocol.RequestHeader.createFromBytes(c_2_s);
logger.debug(head.toString());
var info = protocol.ImageRequest.createFromBytes(c_2_s.slice(constant.ProtocolConstant.REQUESTER_HEAD_LENGTH));
logger.debug(base.toString(info));

logger.info('==== SERVER -> CLIENT ====');
// 1. UPLOAD_OTHER_IMAGE_RESP
var s_2_c = new Buffer("0100258000100000ffd30101000000000000000000000000000000000000000000000000a72f9c7027a5642e6feb1f80649df54700000000000000002a9f0200000000000000000000000000", "hex");
var head = protocol.RequestHeader.createFromBytes(s_2_c);
logger.debug(head.toString());
var packetSize = packetHeadLength + 40;
var imageRes = protocol.ImageResponse.createFromBytes(s_2_c.slice(packetHeadLength, packetSize));
logger.debug(base.toString(imageRes));
var packet = protocol.ImagePacketFactory.getInstance().create(head, imageRes);
logger.debug(base.toString(packet));











/* vim: set ts=4 sw=4 sts=4 tw=100: */
