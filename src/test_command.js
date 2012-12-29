/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_command.js ~ 2012/12/28 22:43:44
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var command = require('./command');
var constant = require('./constant');
var security = require('./security');
var user = require('./user');

security.setMd5Seed(new Buffer([1,2,3,4,5]));

exports.testBaseCommand = function(test) {
  test.done();
}

exports.testVerifyCommand = function(test) {
  var vc = new command.VerifyCommand(constant.VerifyCodeType.VerifyCodeLogin,
    100, 'leeight', 89, 64);
  test.equal(vc.createCommand(), 'security 1.0 R 1\nmethod:verify\nuid2:64\nuid:100\nlid:leeight\ntype:1\n\r\n');

  var vc = new command.VerifyCommand(constant.VerifyCodeType.VerifyCodeAddFriend,
    100, 'leeight', 89, 64);
  test.equal(vc.createCommand(), 'security 1.0 R 2\nmethod:verify\nuid2:64\nuid:100\nlid:leeight\nfriend:89\ntype:2\n\r\n');

  test.done();
}

exports.testLoginCommand = function(test) {
  var lc = new command.LoginCommand('url', 'time', 'period', 'code', {
    priority: 8964,
    account: 'leeight',
    password: 'password',
    imversion: '1,2,3,4',
    redirect_times: '0',
    platform: 'android',
    client_type: 4,
    new_username: 'new_username'
  });
  test.equal(lc.createCommand(), 'login 4.2 R 3\nmethod:login\ncontent-length:203\ncontent-type:text\nv_url:url\nv_time:time\nv_period:period\nv_code:code\npriority:8964\n\r\n<login><user account="leeight" password="c6bbd5bffc05defe745ab0d678513f5d" imversion="1,2,3,4" redirect_times="0" priority="8964" platform="android" client_type="4" new_username="new_username" /></login>');
  test.done();
}

exports.testUserSetStatus = function(test) {
  var ussc = new command.UserSetStatus(constant.USER_STATUS_ONLINE, '你好, 我在线', 8964);
  test.equal(ussc.createCommand(), 'user 2.0 R 4\nmethod:set\ncontent-length:77\ncontent-type:text\nuid:8964\n\r\n<user><account status="1;&#20320;&#22909;, &#25105;&#22312;&#32447;"/></user>');
  test.done();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
