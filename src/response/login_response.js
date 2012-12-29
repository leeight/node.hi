/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/login_response.js ~ 2012/12/29 09:59:21
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
function LoginResponse(base) {
  base_response.BaseResponse.call(this);

  /**
   * @type {int}
   */
  this.imid;

  this.superCommand = base.superCommand;
  this.command = base.command;
  this.type = base.type;
  this.version = base.version;
  this.seq = base.seq;
  this.contentLength = base.contentLength;
  this.contentType = base.contentType;
  this.code = base.code;
  this.xml = base.xml;
  if (this.xml) {
    this.create();
  }
}
base.inherits(LoginResponse, base_response.BaseResponse);

/**
 * <login imid=\"114960740\" server_time=\"1356747061\" firstuse=\"0\" baiduer=\"0\" visible_ip=\"3285472370\" debug_inner_ip=\"0\" />\n
 */
LoginResponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml);
  var login = doc.documentElement;

  this.imid = parseInt(login.getAttribute('imid'), 10) || 0;
}

exports.LoginResponse = LoginResponse;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
