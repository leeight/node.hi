/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response.js ~ 2012/12/28 13:24:11
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var events = require('events');
var base = require('../base');
var utils = require('../utils');
var constant = require('../constant');
var logger = require('../logger').logger;

function BaseResponse() {
  /**
   * @type {string}
   */
  this.superCommand;

  /**
   * @type {string}
   */
  this.command = "";

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.version;

  /**
   * @type {int}
   */
  this.seq;

  /**
   * @type {int}
   */
  this.contentLength;

  /**
   * @type {string}
   */
  this.contentType;

  /**
   * Status Code
   * @type {int}
   */
  this.code;

  /**
   * @type {string}
   */
  this.xml;

  /**
   * @type {string}
   */
  this.cdata;

  /**
   * @type {Buffer}
   */
  this.bodyData;

  this.responseHead = {};
}
base.inherits(BaseResponse, events.EventEmitter);
BaseResponse.SEPARATED = "\r\n";
BaseResponse.SEMICOLON = ":";
BaseResponse.SPACE = " ";
BaseResponse.MESTHOD_KEY = "method";
BaseResponse.CONTENT_LENGTH_KEY = "content-length";
BaseResponse.CONTENT_TYPE_KEY = "content-type";
BaseResponse.CONTENT_CODE_KEY = "code";
BaseResponse.CONTENT_TYPE_TEXT = "text";

BaseResponse._getStatusCode = function(code) {
  switch (code) {
    case 200:
    case 204:
    case 210:
    case 220:
    case 400:
    case 401:
    case 402:
    case 403:
    case 404:
    case 405:
    case 410:
    case 411:
    case 483:
    case 455:
    case 484:
    case 485:
    case 481:
      return code;
    case 408:
      return constant.StausCode.NO_USER;
    case 406:
    case 413:
    case 421:
    case 420:
    case 451:
    case 452:
    case 482:
    case 301:
    case 500:
    case 506:
    case 507:
    case 511:
    case 512:
    case 513:
    case 514:
    case 515:
    case 516:
    case 517:
    case 518:
    case 519:
    case 520:
    case 521:
    case 522:
    case 523:
    case 524:
      return constant.StausCode.SERVER_ERROR;
    default:
      /** 未录入错误返回 **/
      return constant.StausCode.IM_UNKNOWN;
  }
}

/**
 * @param {Buffer} bytes utf-8 encode.
 * @param {BaseResponse}
 */
BaseResponse.createResponse = function(bytes) {
  var response = new BaseResponse();
  var length = bytes.length;
  var header;

  // "security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify\r\n\r\n<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000";
  var index = utils.indexOf(bytes, new Buffer("\r\n\r\n", "ascii"));
  if (index != -1) {
    header = bytes.slice(0, index).toString('utf-8');
    response.bodyData = new Buffer(bytes.slice(index + 4));
    response.xml = utils.stripInvalidChars(response.bodyData.toString('utf-8'));
  } else {
    // 没有消息体
    header = bytes.toString('utf-8');
    response.cdata = header;
    response.xml = null;
  }

  logger.debug('header = [' + JSON.stringify(header) + ']');
  logger.debug('response.xml = [' + JSON.stringify(response.xml) + ']');

  var lines = header.split(/\r?\n/g);
  if (!lines.length) {
    logger.error('invalid header');
    return;
  }

  var statusLine = lines[0];
  var method = statusLine.split(BaseResponse.SPACE);
  if (method.length != 4) {
    logger.error('invalid status line');
    return;
  }

  response.superCommand = method[0];
  response.version = method[1];
  response.type = method[2];
  response.seq = parseInt(method[3], 10);

  for(var i = 1; i < lines.length; i ++) {
    var chunks = lines[i].split(BaseResponse.SEMICOLON);
    if (chunks.length === 2) {
      response.responseHead[chunks[0]] = chunks[1];
    } else {
      logger.error('invalid header line = [' + lines[i] + ']');
    }
  }

  var responseHead = response.responseHead;
  if (responseHead[BaseResponse.CONTENT_CODE_KEY]) {
    response.code = BaseResponse._getStatusCode(parseInt(responseHead[BaseResponse.CONTENT_CODE_KEY], 10));
    delete responseHead[BaseResponse.CONTENT_CODE_KEY];
  }
  if (responseHead[BaseResponse.MESTHOD_KEY]) {
    response.command = responseHead[BaseResponse.MESTHOD_KEY];
  }
  if (responseHead[BaseResponse.CONTENT_LENGTH_KEY]) {
    var value = responseHead[BaseResponse.CONTENT_LENGTH_KEY];
    if (value) {
      value = value.replace(/\s/g, '');
    }
    response.contentLength = parseInt(value, 10) || 0;

    delete responseHead[BaseResponse.CONTENT_LENGTH_KEY];
  }
  if (responseHead[BaseResponse.CONTENT_TYPE_KEY]) {
    response.contentType = responseHead[BaseResponse.CONTENT_TYPE_KEY];

    delete responseHead[BaseResponse.CONTENT_TYPE_KEY];
  }

  return response;
}


exports.BaseResponse = BaseResponse;


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
