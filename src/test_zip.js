/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../test/zip.js ~ 2012/12/28 10:11:57
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var security = require('./security');
var ursa = require('ursa');
var constant = require('./constant');
var logger = require('./logger').logger;

// 'security 1.0 R 1\nmethod:verify\nuid:0\nlid:leeight\nuid2:0\ntype:1\n\r\n'
var messageBytes = new Buffer([115, 101, 99, 117, 114, 105, 116, 121, 32, 49, 46, 48, 32, 82, 32, 49, 10, 109, 101, 116, 104, 111, 100, 58, 118, 101, 114, 105, 102, 121, 10, 117, 105, 100, 58, 48, 10, 108, 105, 100, 58, 108, 101, 101, 105, 103, 104, 116, 10, 117, 105, 100, 50, 58, 48, 10, 116, 121, 112, 101, 58, 49, 10, 13, 10]);
var zipedBytes = new Buffer([120, -38, 43, 78, 77, 46, 45, -54, 44, -87, 84, 48, -44, 51, 80, 8, 82, 48, -28, -54, 77, 45, -55, -56, 79, -79, 42, 75, 45, -54, 76, -85, -28, 42, -51, 76, -79, 50, -32, -54, 1, -110, 57, -87, -87, -103, -23, 25, 37, 32, 17, 35, -96, 80, 73, 101, 65, -86, -107, 33, 23, 47, 23, 0, -55, -21, 20, -102]);
var AES_KEY = new Buffer([-101, 54, 34, -10, 74, -113, 127, 53, -44, -25, 57, 105, 38, -103, 24, -88]);

security.setAesKey(AES_KEY);

exports.testPublicKey = function(test) {
  for(var i = 0; i < constant.IM_RootPubKeyData_PEM.length; i ++) {
    var pem = constant.IM_RootPubKeyData_PEM[i];
    var k1 = new Buffer(pem.replace(/^----.*/gm, '').replace(/\r?\n/g, ''), 'base64').slice(22);
    test.deepEqual(k1, new Buffer(constant.IM_RootPubKeyData[i]));
  }
  test.done();
}

exports.testGetKeyPair = function(test) {
  var pair = security.getKeyPair();
  var k1 = pair[0];
  var k2 = pair[1];
  var last = pair[2];

  var text = 'hello world, 你好世界';
  var encrypted = last.encrypt(text);
  test.equal(128, encrypted.length);
  test.equal(text, last.decrypt(encrypted));
  test.done();
}

exports.testCompressData1 = function(test) {
  security.compressData(messageBytes, function(actual){
    test.deepEqual(actual, zipedBytes);
    test.done();
  });
}

exports.testCompressData2 = function(test) {
  var text = '你好世界';
  security.compressData(text, function(actual){
    security.decompressData(actual, actual.length, function(last){
      test.equal(last, text);
      test.done();
    });
  });
}

exports.testAESEncrypt0 = function(test) {
  var text = "你好世界";
  var last = security.AESDecrypt(security.AESEncrypt(text), 12);
  test.equal(last.toString('utf-8'), text);
  test.done();
}

exports.testAESEncrypt1 = function(test) {
  var expected = new Buffer([-27, 29, -119, -42, 85, -14, -57, 4, 82, -49, 81, 30, 79, 124, -67, -82, 12, -81, 38, 43, -117, 107, -46, 122, -10, -61, 75, 111, -48, -53, 35, -124, -60, 125, 81, 80, 19, 50, 25, -79, -61, 69, 126, -96, 33, 55, 81, -44, -51, 0, 77, -34, -64, -53, 91, -65, 5, -25, -49, -85, 35, 85, -44, -127, 107, 24, 98, 122, -4, 36, -123, -69, 126, 111, -78, 60, -65, -9, -109, 99]);
  var actual = security.AESEncrypt(zipedBytes);
  test.deepEqual(actual, expected);
  test.done();
}

exports.testAESEncrypt2 = function(test) {
  var expected = new Buffer([58, 38, 2, 56, 97, 52, 114, 114, -23, 58, -9, 21, -105, 97, -98, 31]);
  var actual = security.AESEncrypt("你好世界");
  test.deepEqual(actual, expected);
  test.done();
}

exports.testAESDecrypt0 = function(test) {
  var raw = "Z5JhJ8BfNabWL1YxhRdKDGmA4iuCXXkpO1aicRBAQ1oGPkmCLG+BW9dMXAkVi0Zj2SXlN+vJCfpww+m47rQHuTnQq//zjlfuwypcAGmo/4k/MZlBc8wQRLxGzSEx+iuleYbcoGqVTsD52IjXEUeoJZ/SBbkV4IMATE9bgnK3yJaRNL9oKUrbGSkQJFwOz4r1CXQvKzRJzxL1JfwHHIrzwQLdkbDbHmxszxbuk+d1ho/cPcF00/dqt6DhgC0NXH9vzqcGRiStsQFE/ANjzi9RtIJ2qYd3bGJz5WCZ+NAb9hb98gyt05VcKq5ihjosFkK/d915SUnUNWXXtoyDRzjgRxyspRlMn/1B+OlVshELxQFuFb6dWyx8PoF3wn2Sj0H926LfIpubdba/P2PubIVzfg==";
  var key = "J/j6+myzFcR3ifOxj0TIhA==";
  var expected = "security 1.0 A 1\r\ncode:200\r\ncontent-length:216\r\ncontent-type:text\r\nmethod:verify\r\n\r\n<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />\n\u0000\u0000\u0000\u0000";

  security.setAesKey(new Buffer(key, 'base64'));
  var encryptedData = new Buffer(raw, 'base64');
  var last = security.AESDecrypt(encryptedData, encryptedData.length);
  test.equal(last.toString('ascii'), expected);
  test.done();
}



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
