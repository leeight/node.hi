/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/login_ready_response.js ~ 2012/12/31 15:24:19
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');

function LoginReadyResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);
}
base.inherits(LoginReadyResponse, base_response.BaseResponse);

exports.LoginReadyResponse = LoginReadyResponse;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
