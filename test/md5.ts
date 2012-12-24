/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test/md5.js ~ 2012/12/22 20:06:25
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var filename = process.argv[2];
var crypto = require('crypto');
var fs = require('fs');

var md5sum = crypto.createHash('md5');

var s = fs.ReadStream(filename);
s.on('data', function(d) {
  md5sum.update(d);
});

s.on('end', function() {
  var d = md5sum.digest('hex');
  console.log(d + '  ' + filename);
});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
