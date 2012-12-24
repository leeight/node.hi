/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * utils.js ~ 2012/12/23 11:53:05
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
/**
 * @type {Buffer} a
 * @type {Buffer} b
 * @return {Buffer}
 */
exports.sumArray = function(a, b) {
  var c = new Buffer(a.length + b.length);
  c.fill(0);
  a.copy(c, 0, 0, a.length);
  b.copy(c, a.length, 0, b.length);
  return c;
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
