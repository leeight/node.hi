/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/image_srv_response.js ~ 2013/01/09 22:41:23
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 查询图片服务器的返回结果.
 **/
var base_response = require('./base_response');
var base = require('../base');
var model = require('../model');
var logger = require('../logger').getLogger(__filename);

/**
 * 貌似不需要解析什么内容.
 * @constructor
 * @extends {base_response.BaseRespose}
 */
function ImageSrvResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {Buffer}
   */
  this.token;

  /**
   * @type {string}
   */
  this.ip;

  /**
   * @type {number}
   */
  this.port;

  if (this.bodyData) {
    this.create();
  }
}
base.inherits(ImageSrvResponse, base_response.BaseResponse);

ImageSrvResponse.prototype.create = function() {
  if (this.bodyData.length < 10) {
    logger.warn("this.bodyData is too small [%s], minimize size should be 10.",
      this.bodyData.length);
    return;
  }

  logger.debug('ImageSrvResponse.bodyData = [%s]', this.bodyData.toString('base64'));

  this.token = this.bodyData.slice(0, 4);
  this.ip = [this.bodyData[4], this.bodyData[5], this.bodyData[6], this.bodyData[7]].join('.');
  this.port = this.bodyData.readInt16BE(8);

  logger.debug(base.toString(this));
};















exports.ImageSrvResponse = ImageSrvResponse;


/* vim: set ts=4 sw=4 sts=4 tw=100: */
