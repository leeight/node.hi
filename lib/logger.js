/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * logger.js ~ 2012/12/26 18:01:27
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var log4js = require('log4js');
log4js.configure({
  appenders: [
    {type: 'file', filename: 'hi.log'},
    {type: 'console'}
  ],
  replaceConsole: true
});
log4js.loadAppender('file');

module.exports = log4js;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
