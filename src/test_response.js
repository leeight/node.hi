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

  test.equal(rv.code, 300);
  test.equal(rv.command, "");
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



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
