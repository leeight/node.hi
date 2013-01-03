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
var logger = require('./logger').getLogger(__filename);

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

function getImageUri(imagePath) {
  return imagePath;
}

/**
 * XML格式的消息转化称普通的文本格式
 * <msg>
 *  <font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />
 *  <text c="asdfasdf" />
 *  <face id="d58" n="猪头" />
 *  <text c="fasdfasdf" />
 *  <url c="http://www.baidu.com" />
 *  <cface md5="自定义表情的md5" t="自定义表情的类型bmp|jpg|png等" n="自定义表情名字" sc="快捷方式" />
 *  <reply />
 *  <img md5="" t="" >
 *    <thumb thumbdata="" />
 *  </img>
 * </msg>
 */
exports.xml2text = function(xml) {
  if (!xml) {
    logger.error('xml2text failed, xml = [' + xml + ']');
    return null;
  }

  var fs = require('fs');
  var path = require('path');
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(xml.replace(/\u0000/g, ''));
  var root = doc.documentElement;

  var msg = [];
  for(var i = 0, j = root.childNodes.length; i < j; i ++) {
    var node = root.childNodes[i];
    if (node.nodeType === 1) {
      switch(node.nodeName.toUpperCase()) {
        case 'TEXT': {
          msg.push(node.getAttribute('c'));
          break;
        }
        case 'FACE': {
          msg.push('[' + node.getAttribute('n') + ']');
          break;
        }
        case 'REPLY': {
          var type = parseInt(node.getAttribute('t')) || 0;
          if (type === 2) {
            msg.push('『引用:');
            msg.push(node.getAttribute('c'));
            msg.push('』');
          } else {
            var name = node.getAttribute('n') || '--';
            msg.push('『回复:');
            msg.push(name + ';');
            msg.push(node.getAttribute('c'));
            msg.push('』');
          }
          break;
        }
        case 'IMG': {
          var md5 = node.getAttribute('md5');
          var type = node.getAttribute('t');
          if (node.childNodes.length) {
            var child = node.childNodes[0];
            var nodeName = child.nodeName.toUpperCase();
            var imageName = (md5 + '.' + type).toLowerCase();
            var imagePath;
            var imageData;
            if (nodeName === 'THUMB') {
              imagePath = path.join('data', 'images', 'thumb', imageName);
              imageData = child.getAttribute('thumbdata');
              fs.writeFileSync(imagePath, new Buffer(imageData, 'base64'));
              msg.push('<img src="' + getImageUri(imagePath) + '" />');
            } else if (nodeName === 'IMAGE') {
              imagePath = path.join('data', 'images', 'large', imageName);
              imageData = child.getAttribute('imagedata');
              fs.writeFileSync(imagePath, new Buffer(imageData, 'base64'));
              msg.push('<img src="' + getImageUri(imagePath) + '" />');
            }
          }
          break;
        }
        case 'CFACE': {
          msg.push('[表情]');
          break;
        }
        case 'URL': {
          msg.push(' ' + node.getAttribute('c') + ' ');
          break;
        }
      }
    }
  }

  return msg.join('');
}

exports.dumpBuffer = function(buffer) {
  return "\n" + require("hexy").hexy(buffer);
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
