/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/all.js ~ 2012/12/28 22:06:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var verify_response = require('./verify_response');
var login_response = require('./login_response');
var user_set_response = require('./user_set_response');
var user_query_response = require('./user_query_response');

exports.BaseResponse = base_response.BaseResponse;
exports.VerifyResponse = verify_response.VerifyResponse;
exports.LoginResponse = login_response.LoginResponse;
exports.UserSetResponse = user_set_response.UserSetResponse;
exports.UserQueryReponse = user_query_response.UserQueryReponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
