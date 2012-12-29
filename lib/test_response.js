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



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
