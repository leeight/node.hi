/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * logic/verify_response.js ~ 2012/12/28 18:20:24
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');

/**
 * @param {BaseResponse} base 用来初始化一些子类的信息.
 */
function VerifyResponse(base) {
  base_response.BaseResponse.call(this);

  /**
   * @type {string}
   */
  this.superCommand = base.superCommand;

  /**
   * @type {string}
   */
  this.command = base.command;

  /**
   * @type {string}
   */
  this.type = base.type;

  /**
   * @type {string}
   */
  this.version = base.version;

  /**
   * @type {int}
   */
  this.seq = base.seq;

  /**
   * @type {int}
   */
  this.contentLength = base.contentLength;

  /**
   * @type {string}
   */
  this.contentType = base.contentType;

  /**
   * @type {int}
   */
  this.code = base.code;

  /**
   * @type {string}
   */
  this.xml = base.xml;

  /**
   * @type {string}
   */
  this.url;

  /**
   * @type {string}
   */
  this.time;

  /**
   * @type {string}
   */
  this.period;

  /**
   * @type {string}
   */
  this.verify_code;

  if (this.xml != null) {
    this.create();
  }
}
base.inherits(VerifyResponse, base_response.BaseResponse);

/**
 * 初始化this.url, this.time, this.period, this.code
 */
VerifyResponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml);
  var verify = doc.documentElement;

  this.url = verify.getAttribute("v_url");
  this.time = verify.getAttribute("v_time");
  this.verify_code = verify.getAttribute("v_code");
  this.period = verify.getAttribute("v_period");
}

exports.VerifyResponse = VerifyResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
