/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * a.js ~ 2012/12/24 20:59:02
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var constant = require('./constant');

for(var i = 0; i < constant.IM_RootPubKeyData.length; i ++) {
  console.log(new Buffer(constant.IM_RootPubKeyData[i]).toString('base64'));
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
