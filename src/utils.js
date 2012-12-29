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

exports.stripInvalidChars = function(xml) {
  var array = [
    '00', '01', '02', '03', '04', '05', '06', '07',
    '08', '0b', '0B', '0c', '0C', '0e', '0E', '0f',
    '0F', '10', '11', '12', '13', '14', '15', '16',
    '17', '18', '19', '1a', '1b', '1B', '1c', '1C',
    '1d', '1D', '1e', '1E', '1f', '1F', '0d', '0a',
    '1A'
  ];
  var pattern = new RegExp('&#x' + array.join('|&#x'), 'gi');
  return xml.replace(pattern, '');
}

/**
 * @param {Buffer} a
 * @param {Buffer} b
 */
exports.indexOf = function(a, b) {
  if (a.length < b.length) {
    return -1;
  } else if (a.length === b.length) {
    for(var i = 0; i < a.length; i ++) {
      if (a[i] !== b[i]) {
        return -1;
      }
    }
    return 0;
  } else {
    var al = a.length;
    var bl = b.length;

    for(var i = 0; i < al; i ++) {
      if (a[i] === b[0]) {
        for(var j = 0; (a[i + j] === b[j]) && ((i + j) < al) && (j < bl); j ++);
        if (j === bl) {
          return i;
        }
      }
    }
  }
  return -1;
}

/**
 * 自己想办法生成一个.
 * @param {string} hexMd5 32个字节长度.
 */
exports.getSoftwareUUID = function(hexMd5) {
  var buffer = ['HI'];
  buffer.push(hexMd5.substr(0, 16));

  var start = parseInt(hexMd5[2], 16);
  for(var i = 0; i < 4; i ++) {
    var index = (start + i * 8 + 1) % hexMd5.length;
    buffer.push(hexMd5[index]);
  }
  buffer.push(hexMd5.substr(16, 16));

  return buffer.join('').toUpperCase();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
