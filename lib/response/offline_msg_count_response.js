/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/offline_msg_count_response.js ~ 2013/01/03 13:51:44
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');

function OfflineMsgCountResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * 离线消息的数量.
   * @type {int}
   */
  this.count;

  this.create();
}
base.inherits(OfflineMsgCountResponse, base_response.BaseResponse);

OfflineMsgCountResponse.prototype.create = function() {
  this.count = parseInt(this.responseHead['count'], 10) || 0;
}

exports.OfflineMsgCountResponse = OfflineMsgCountResponse;






















/* vim: set ts=4 sw=4 sts=4 tw=100: */
