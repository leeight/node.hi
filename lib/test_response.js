/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_response.js ~ 2012/12/28 14:56:53
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var response = require('./response/all');
var utils = require('./utils');
var base = require('./base');

exports.testIndexOf = function(test) {
  var a = new Buffer("security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify\r\n\r\n<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000", "utf-8");
  var b = new Buffer("\r\n\r\n", 'ascii');

  test.equal(80, utils.indexOf(a, b));
  test.done();
}

exports.testCreateResponse = function(test) {
  var bytes = new Buffer("security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify\r\n\r\n<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000", "utf-8");

  var rv = response.BaseResponse.createResponse(bytes);
  test.equal(rv.code, 200);
  test.equal(rv.command, "verify");
  test.equal(rv.superCommand, "security");
  test.equal(rv.version, "1.0");
  test.equal(rv.type, "A");
  test.equal(rv.seq, 1);
  test.equal(rv.contentLength, 216);
  test.equal(rv.contentType, 'text');
  test.equal(rv.xml, '<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000');
  test.ok(!rv.cdata);
  test.ok(!rv.responseHead['content-length']);
  test.ok(!rv.responseHead['content-type']);
  test.ok(!rv.responseHead['code']);

  test.done();
}

exports.testCreateResponseWithoutMessageBody = function(test) {
  var bytes = new Buffer("security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify", "utf-8");

  var rv = response.BaseResponse.createResponse(bytes);
  test.equal(rv.code, 200);
  test.equal(rv.command, "verify");
  test.equal(rv.superCommand, "security");
  test.equal(rv.version, "1.0");
  test.equal(rv.type, "A");
  test.equal(rv.seq, 1);
  test.equal(rv.contentLength, 216);
  test.equal(rv.contentType, 'text');
  test.equal(rv.cdata, "security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify");
  test.ok(!rv.xml);
  test.ok(!rv.responseHead['content-length']);
  test.ok(!rv.responseHead['content-type']);
  test.ok(!rv.responseHead['code']);

  test.done();
}

exports.testMixin = function(test) {
  var bytes = new Buffer("security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify\r\n\r\n<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000", "utf-8");

  var rv = response.BaseResponse.createResponse(bytes);
  rv = base.mixin({
    code: 300,
    command: '',
  }, rv);

  test.equal(rv.code, 200);
  test.equal(rv.command, "verify");
  test.equal(rv.superCommand, "security");
  test.equal(rv.version, "1.0");
  test.equal(rv.type, "A");
  test.equal(rv.seq, 1);
  test.equal(rv.contentLength, 216);
  test.equal(rv.contentType, 'text');
  test.equal(rv.xml, '<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000');
  test.ok(!rv.cdata);
  test.ok(!rv.responseHead['content-length']);
  test.ok(!rv.responseHead['content-type']);
  test.ok(!rv.responseHead['code']);

  test.done();
}

exports.testLoginResponse = function(test) {
  var bytes = new Buffer("login 4.2 A 2\r\ncode:200\r\ncontent-length:120\r\ncontent-type:text\r\nmethod:login\r\n\r\n<login imid=\"114960740\" server_time=\"1356939836\" firstuse=\"0\" baiduer=\"0\" visible_ip=\"3285472370\" debug_inner_ip=\"0\" />\n", "utf-8");

  var father = response.BaseResponse.createResponse(bytes);
  var lr = new response.LoginResponse(father);

  test.equal(lr.visible_ip, 3285472370);
  test.equal(lr.debug_inner_ip, 0);
  test.equal(lr.baiduer, 0);
  test.equal(lr.imid, 114960740);
  test.equal(lr.server_time, 1356939836);
  test.equal(lr.firstuse, 0);
  test.equal(lr.superCommand, 'login');
  test.equal(lr.command, 'login');
  test.done();
}

exports.testUserQueryReponse = function(test) {
  var xml = [
    '<user uid="20079852">',
      '<account ',
          'baiduid="Lucifer52xue" ',
          'personal_comment="y3##(#d9到时候好伤心很喜欢十九世纪手机电视基督教我问问你到家加拿大刚到家豆浆机小姐很纠结呼吸机先进性九鼎记多久饭ijkfkfcet刚开学喝好几回和谐不及格好好学习天天向上回电话好像" ',
          'birthday="1982-8-25" ',
          'email="" ',
          'head="6bd038f40d79bffab19a1b7af3560b54;丹顶鹤;jpg" ',
          'name="" ',
          'nickname="" ',
          'phone="" ',
          'sex="1" ',
          'email_fixed="0" />',
    '</user>'
  ].join('');
  var uqr = new response.UserQueryReponse({
    xml: xml
  });
  var user = uqr.getUser();
  test.equal(user.imid, 20079852);
  test.equal(user.account, 'Lucifer52xue');
  test.equal(user.personal_comment, 'y3##(#d9到时候好伤心很喜欢十九世纪手机电视基督教我问问你到家加拿大刚到家豆浆机小姐很纠结呼吸机先进性九鼎记多久饭ijkfkfcet刚开学喝好几回和谐不及格好好学习天天向上回电话好像');
  test.equal(user.birthday, '1982-8-25');
  test.equal(user.email, '');
  test.equal(user.avatar, '6bd038f40d79bffab19a1b7af3560b54.jpg');
  test.equal(user.name, '');
  test.equal(user.nickname, '');
  test.equal(user.phone, '');
  test.equal(user.sex, 1);
  test.done();
}

exports.testMsgNotifyResponse = function(test) {
  var bytes = new Buffer(
    "msg 1.2 N 558\r\n" +
    "addon:status=2\r\n" +
    "basemsgid:3836574952\r\n" +
    "content-length:153\r\n" +
    "content-type:text\r\n" +
    "from:8964\r\n" +
    "from_sub:0\r\n" +
    "method:msg_notify\r\n" +
    "msgid:29\r\n" +
    "subid:0\r\n" +
    "sys_sess:00340100abcd010050dea5b10101d3ff000000000a1a34153e80000050de61290000000000000000000000000000000000000000\r\n" +
    "time:1356768688979\r\n" +
    "to:114960740\r\n" +
    "type:1\r\n" +
    "uid:16897023\r\n" +
    "waitack:120\r\n", "utf-8");

  var father = response.BaseResponse.createResponse(bytes);
  var mnr = new response.MsgNotifyResponse(father);
  test.equal(mnr.msg_type, 1);
  test.equal(mnr.from_id, 8964);
  test.equal(mnr.to_id, 114960740);
  test.equal(mnr.base_msg_id, 3836574952);
  test.equal(mnr.time, 1356768688979);
  test.equal(mnr.uid, 16897023);
  test.equal(mnr.wait_ack, 120);
  test.done();
}

exports.testContactNotifyResponse = function(test) {
  var bytes = new Buffer("contact 2.10 N 20\r\ncontent-length:92\r\ncontent-type:text\r\nmethod:notify\r\n\r\n<contact imid=\"114960740\" status=\"1;\" has_camera=\"0\" music=\"\" psp_status=\"0\" cli_type=\"4\" />", "utf-8");

  var father = response.BaseResponse.createResponse(bytes);
  var cnr = new response.ContactNotifyResponse(father);

  test.equal(cnr.friend.psp_status, 0);
  test.equal(cnr.friend.music, '');
  test.equal(cnr.friend.client_type, 4);
  test.equal(cnr.friend.has_camera, 0);
  test.equal(cnr.friend.status, 1);
  test.equal(cnr.friend.imid, 114960740);
  test.equal(cnr.friend.sex, 0);
  test.ok(!cnr.friend.personal_comment);
  test.ok(!cnr.friend.nickname);
  test.ok(!cnr.friend.name);
  test.ok(!cnr.friend.email);
  test.ok(!cnr.friend.avatar);
  test.ok(!cnr.friend.timestamp);
  test.ok(!cnr.friend.personal_desc);
  test.ok(!cnr.friend.birthday);
  test.done();
}

exports.testCmBlkResponse = function(test) {
  var bytes = new Buffer('cm 1.0 R 565\r\nfrom:16897023\r\nmethod:blk\r\nsub_id:0\r\nsys_sess:00340100abcd010050e194eb0101d3ff000000000a1a35173e80000050e13f710000000000000000000000000000000000000000\r\nto:114960740\r\ntype:1\r\nuid:16897023\r\n', 'utf-8');
  var father = response.BaseResponse.createResponse(bytes);
  var cbr = new response.CmBlkResponse(father);

  test.equal(cbr.sub_id, 0);
  test.equal(cbr.from_id, 16897023);
  test.equal(cbr.sys_sess, '00340100abcd010050e194eb0101d3ff000000000a1a35173e80000050e13f710000000000000000000000000000000000000000');
  test.equal(cbr.to_id, 114960740);
  test.equal(cbr.msg_type, 1);
  test.equal(cbr.uid, 16897023);
  test.equal(cbr.uid, cbr.from_id);
  test.equal(cbr.type, 'R');
  test.equal(cbr.superCommand, 'cm');
  test.equal(cbr.command, 'blk');
  test.done();
}

exports.testMsgAckNotifyResponse = function(test) {
  var bytes = new Buffer("msg 1.2 N 1186\r\ncontent-length:39\r\ncontent-type:text\r\nfrom:16897023\r\nfrom_sub:0\r\nmethod:msg_ack_notify\r\nsys_sess:00340100abcd020050e295150101d3ff000000000a410cd23e80000050e294b606da2964000000000a2e6e343e80000050e294cf\r\nto:114960740\r\nto_sub:0\r\ntype:1\r\n\r\n<acks><ack id=\"1357026576421\"/><empty/><ack id=\"1357026576426\"/></acks>\u0000", "utf-8");
  var father = response.BaseResponse.createResponse(bytes);
  var manr = new response.MsgAckNotifyResponse(father);

  test.equal(manr.superCommand, 'msg');
  test.equal(manr.command, 'msg_ack_notify');
  test.equal(manr.last_ack, 1357026576426);
  test.done();
}

exports.testFriendGetFriendResponse = function(test) {
  var bytes = new Buffer("friend 2.10 A 6\r\nmethod:get_friend\r\ncode:200\r\ncontent-type:text\r\ncontent-length:283\r\n\r\n<friend_set>\n\t<friend imid=\"16897023\" team=\"0\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"32353201\" team=\"240\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"327616233\" team=\"0\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"346518627\" team=\"0\" validated=\"1\" monicker=\"\" />\n</friend_set>\n", "utf-8");
  var father = response.BaseResponse.createResponse(bytes);

  var fgfr = new response.FriendGetFriendResponse(father);
  test.equal(fgfr.superCommand, 'friend');
  test.equal(fgfr.command, 'get_friend');
  test.equal(fgfr.friends.length, 4);
  test.done();
}

exports.testContactQueryResponse = function(test) {
  var bytes = new Buffer("contact 3.15 A 7\r\ncode:200\r\ncontent-length:1151\r\ncontent-type:text\r\nmethod:query\r\n\r\n<contact_set>\n    <contact imid=\"32353201\" baiduid=\"yaoasm\" personal_comment=\"\" nickname=\"\" head=\"\" name=\"\" birthday=\"1980-2-24\" personal_desc=\"\" sex=\"2\" cli_type=\"0\" email=\"yaoasm1@126.com\" status=\"5\" email_fixed=\"1\" timestamp=\"1\" />\n    <contact imid=\"346518627\" baiduid=\"wangminsy001\" personal_comment=\"F5-B187 6058-0425  ;;wangmin02@baidu.com;;求UE\" nickname=\"王敏\" head=\"1e82e5a0e0bd1081cf2b5a99e9b1cd93;20120822100544;png\" name=\"\" birthday=\"0-0-0\" personal_desc=\"\" sex=\"2\" cli_type=\"0\" email=\"wangm1800@163.com\" status=\"5\" email_fixed=\"1\" timestamp=\"73\" />\n    <contact imid=\"16897023\" baiduid=\"leeight\" personal_comment=\"\" nickname=\"\" head=\"691e568b132ffddfc478d619cc397e16;20121106180725;gif\" name=\"李玉北\" birthday=\"2008-3-31\" personal_desc=\"\" sex=\"1\" cli_type=\"0\" email=\"liyubei@baidu.com\" status=\"5\" email_fixed=\"1\" timestamp=\"191\" />\n    <contact imid=\"327616233\" baiduid=\"panjun0108\" personal_comment=\"已离职 msn: panjun108@gmail.com\" nickname=\"潘军\" head=\"\" name=\"\" birthday=\"0-0-0\" personal_desc=\"\" sex=\"1\" cli_type=\"0\" email=\"panjun@baidu.com\" status=\"5\" email_fixed=\"1\" timestamp=\"23\" />\n</contact_set>\n", "utf-8");
  var father = response.BaseResponse.createResponse(bytes);

  var cqr = new response.ContactQueryResponse(father);
  test.equal(cqr.superCommand, 'contact');
  test.equal(cqr.command, 'query');
  test.equal(cqr.friends.length, 4);
  test.equal(cqr.friends[0].imid, 32353201);
  test.equal(cqr.friends[0].baiduid, "yaoasm");
  test.equal(cqr.friends[1].imid, 346518627);
  test.equal(cqr.friends[1].nickname, "王敏");
  test.equal(cqr.friends[2].imid, 16897023);
  test.equal(cqr.friends[2].avatar, "691e568b132ffddfc478d619cc397e16.gif");
  test.equal(cqr.friends[3].imid, 327616233);
  test.equal(cqr.friends[3].personal_comment, "已离职 msn: panjun108@gmail.com");
  test.done();
}



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
