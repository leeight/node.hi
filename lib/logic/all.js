/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * logic/all.js ~ 2012/12/28 18:14:31
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var login = require('./login');
var notification = require('./notification');
var friend = require('./friend');

exports.all = function() {
  return [
    new login.Login(),
    new notification.Notification(),
    new friend.Friend()
  ];
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
