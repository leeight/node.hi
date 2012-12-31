/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/cm_blk_response.js ~ 2012/12/31 21:37:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 闪屏振动
 **/
var base_response = require('./base_response');
var base = require('../base');

function CmBlkResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {int}
   */
  this.from_id;

  /**
   * @type {int}
   */
  this.to_id;

  /**
   * 应该跟from_id一样.
   * @type {int}
   */
  this.uid;

  /**
   * @type {int}
   */
  this.msg_type;

  /**
   * @type {int}
   */
  this.sub_id;

  /**
   * @type {string}
   */
  this.sys_sess;

  this.create();
}
base.inherits(CmBlkResponse, base_response.BaseResponse);

CmBlkResponse.prototype._getHeadValue = function(key) {
  var value = this.responseHead[key];
  delete this.responseHead[key];
  return value;
}

CmBlkResponse.prototype.create = function() {
  this.msg_type = parseInt(this._getHeadValue('type'), 10) || 0;
  this.from_id = parseInt(this._getHeadValue('from'), 10) || 0;
  this.to_id = parseInt(this._getHeadValue('to'), 10) || 0;
  this.uid = parseInt(this._getHeadValue('uid'), 10) || 0;
  this.sys_sess = this._getHeadValue('sys_sess');
  this.sub_id = parseInt(this._getHeadValue('sub_id'), 10) || 0;
}

exports.CmBlkResponse = CmBlkResponse;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
