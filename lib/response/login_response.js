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
 * @param {BaseResponse} father 用来初始化一些子类的信息.
 */
function LoginResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {int}
   */
  this.imid;

  /**
   * @type {int}
   */
  this.server_time;

  /**
   * @type {int}
   */
  this.firstuse;

  /**
   * 是否是百度员工
   * @type {int}
   */
  this.baiduer;

  /**
   * 客户端对外的IP
   * @type {int}
   */
  this.visible_ip;

  /**
   * @type {int}
   */
  this.debug_inner_ip;

  if (this.xml) {
    this.create();
  }
}
base.inherits(LoginResponse, base_response.BaseResponse);

/**
 * FIXME(leeight) 需要处理登陆重定向的情况.
 * <login imid=\"114960740\" server_time=\"1356747061\" firstuse=\"0\" baiduer=\"0\" visible_ip=\"3285472370\" debug_inner_ip=\"0\" />\n
 */
LoginResponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml);
  var login = doc.documentElement;

  this.imid = parseInt(login.getAttribute('imid'), 10) || 0;
  this.server_time = parseInt(login.getAttribute('server_time'), 10) || 0;
  this.firstuse = parseInt(login.getAttribute('firstuse'), 10) || 0;
  this.baiduer = parseInt(login.getAttribute('baiduer'), 10) || 0;
  this.visible_ip = parseInt(login.getAttribute('visible_ip'), 10) || 0;
  this.debug_inner_ip = parseInt(login.getAttribute('debug_inner_ip'), 10) || 0;
}

exports.LoginResponse = LoginResponse;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
