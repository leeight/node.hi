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
var fs = require('fs');
var path = require('path');
var base = require('../base');

fs.readdirSync(__dirname).filter(function(name){
  return name.match(/\.js$/) && name !== 'all.js'
}).forEach(function(response){
  base.mixin(module.exports, require(path.join(__dirname, response)));
});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
