/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/user_set_response.js ~ 2012/12/29 13:20:12
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');

/**
 * @param {BaseResponse} father
 */
function UserSetResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);
}
base.inherits(UserSetResponse, base_response.BaseResponse);

exports.UserSetResponse = UserSetResponse;






















/* vim: set ts=4 sw=4 sts=4 tw=100: */
