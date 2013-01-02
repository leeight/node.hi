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
var login_ready_response = require('./login_ready_response');
var user_set_response = require('./user_set_response');
var user_query_response = require('./user_query_response');
var msg_notify_response = require('./msg_notify_response');
var msg_ack_notify_response = require('./msg_ack_notify_response');
var cm_blk_response = require('./cm_blk_response');
var dummy_response = require('./dummy_response');
var contact_notify_response = require('./contact_notify_response');
var friend_get_friend_response = require('./friend_get_friend_response');
var contact_query_response = require('./contact_query_response');

exports.BaseResponse = base_response.BaseResponse;
exports.VerifyResponse = verify_response.VerifyResponse;
exports.LoginResponse = login_response.LoginResponse;
exports.LoginReadyResponse = login_ready_response.LoginReadyResponse;
exports.UserSetResponse = user_set_response.UserSetResponse;
exports.UserQueryReponse = user_query_response.UserQueryReponse;
exports.MsgNotifyResponse = msg_notify_response.MsgNotifyResponse;
exports.MsgAckNotifyResponse = msg_ack_notify_response.MsgAckNotifyResponse;
exports.ContactNotifyResponse = contact_notify_response.ContactNotifyResponse;
exports.CmBlkResponse = cm_blk_response.CmBlkResponse;
exports.FriendGetFriendResponse = friend_get_friend_response.FriendGetFriendResponse;
exports.ContactQueryResponse = contact_query_response.ContactQueryResponse;
exports.DummyResponse = dummy_response.DummyResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
