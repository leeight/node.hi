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
var utils = require('./utils');

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
    security.decompressData(actual, actual.length, function(err, last){
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

exports.testIndexOf = function(test) {
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([3,4])), 2);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([3])), 2);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([1,2,3])), 0);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([0,1,2,3])), -1);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([1,2,3,4])), 0);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([1,2,3,4,5])), 0);
  test.equal(utils.indexOf(new Buffer([1,2,3,4,5]), new Buffer([1,2,3,4,5,6])), -1);
  test.done();
}

exports.testXmlParser = function(test) {
  var xml = "<verify v_url=\"AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B\" v_time=\"1356664841\" v_period=\"96733780b7286e0a2d47bb5a2ef2bfce\" v_code=\"EU56\" />";

  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(xml);
  var verify = doc.documentElement;
  test.equal("AA2C62500072FB3FBE0D0BEAA4C68CB45EE9DB473259C00A32B22F074A858B4C651EA1D4F749482F743C7746FB0B44C68C818297F13B572C15EC2B", 
    verify.getAttribute('v_url'));
  test.equal("1356664841", verify.getAttribute("v_time"));
  test.equal("96733780b7286e0a2d47bb5a2ef2bfce", verify.getAttribute("v_period"));
  test.equal("EU56", verify.getAttribute("v_code"));

  test.done();
}

exports.testEntitiesModule = function(test) {
  test.equal(require('entities').encode("WORLD\x00\x01\"<>&HELLO, 你好, 世界", 0),
    "WORLD&#0;&#1;&quot;&lt;&gt;&amp;HELLO, &#20320;&#22909;, &#19990;&#30028;");
  test.done();
}

exports.testGetSoftwareUUID = function(test) {
  var md5 = '3c4292ae95be58e0c58e4e5511f09647';
  test.equal(utils.getSoftwareUUID(md5), 'HI3C4292AE95BE58E028E6C58E4E5511F09647');
  test.equal(security.md5sum("hello world."), md5);
  test.done();
}

exports.testXml2Text = function(test) {
  var xml = [
    '<msg>',
      '<font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />',
      '<text c="asdfasdf" />',
      '<face id="d58" n="猪头" />',
      '<text c="fasdfasdf" />',
      '<url c="http://www.baidu.com" />',
    '</msg>'
  ].join('');

  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(xml);
  var root = doc.documentElement;
  test.equal(root.childNodes.length, 5);
  test.equal(root.childNodes[0].nodeName, 'font');
  test.equal(root.childNodes[0].nodeType, 1);
  test.equal(root.childNodes[1].nodeName, 'text');
  test.equal(root.childNodes[2].nodeName, 'face');
  test.equal(root.childNodes[3].nodeName, 'text');
  test.equal(root.childNodes[4].nodeName, 'url');
  test.done();
}

exports.testXml2Text2 = function(test) {
  var xml = [
    '<msg>',
      '<font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />',
      '<text c="asdfasdf" />',
      '<face id="d58" n="猪头" />',
      '<text c="fasdfasdf" />',
      '<url c="http://www.baidu.com" />',
      '<cface />',
      '<reply t="1" c="这里是回复的内容"/>',
      '<img md5="md5sum" t="gif"><thumb thumbdata="base64data" /></img>',
      '<img md5=\"C32292865B15D051A847FA9F35D6091B\" t=\"jpg\" n=\"6068e22e-d05f-4386-9f1e-50485ce683d1\"><thumb thumbdata=\"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoM\r\nDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQs\r\nNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wA\r\nARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAt\r\nRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2Jy\r\nggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXq\r\nDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2u\r\nHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/\r\n8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAV\r\nYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ\r\n3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1d\r\nbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U65/x9Yw6n4M1izubVb23\r\nuLZ4Zbd5GjEiMMMpZeRkE9K6Cs/xBNDBo149wYhAI23mZgqYxzuLcY+tNCex84fCTxrbPda\r\nNHaaJFePrF1dSHUtOkmjjihjnfZvT5ycLtUk4UuGPHb5F+O/xX0Hwn8QdI8T+K4dRl06xu7\r\n6KMaQkckkZjAtkchyuVAPOGHzbRnkY+2/hP4Nu/hp4C0zRtIu9O1I6bFOt3PEgPmb5PM42v\r\nhDjIyd3b8fz9+NvgOD4x+PtI8ESzf2auqR3scdzOVUxyQ2kEiSYUlTueMA8n5Xb+Igq6vL0\r\n2OenfmjzPv+R9+/sNeNPDPjf4FW114U1yPX9NtLs2b3CwyQskqQwlkdHAKsAynAyMMCCc5r\r\n6Dr5g/4J5fAm2/Z8+COqeHrbXV8Qi716bUXuVjEYRnt7dNmAT0EQPXvX0/UJWVkbQtyrl2C\r\nue+INxFaeCtYuJ4o54obZpWjmxtYKN3OSB27kV0NYvjNoV8Kat9ouEtYWtpEaeQ4VAVIyTk\r\nevrVLdDlsz5n+DHjeXVvDnh6S00HTtRsNR0pr658R22nxW7AeQ7JI6xkrEW+QBScgHBA4r4\r\nh+Kvi7T9D+Kng3VtZ8Sf8ItZI9/N/arWsk3lv5UQQGJFPU4XJHGeRjNfoBosdn4G+C2i6BZ\r\nasl/pdlokGhfaoVU/aAIvKWQckAHBOAT9a/Or45WmjeKPinoNlrUYl01zqDumGIJVoyO2MZ\r\nXtz1orNO+mhzU37yu9k/yZ+i37CHinT/F3wh1a90zxLZ+KrVdcli+3WaSIARb252MrgFWAI\r\nOOmCK+j6+ZP+Cfdp4cs/gtqyeGbKKxszr07TJCgQNKYLf5sADnbsHTtX03WcFFRSirLsdEH\r\neKYVgeN4bmfw9cpBDps8ZRzOmrOVtzGEY/OQDxu259s/St+q+oWMWp2NxaXCloLiNopFBIJ\r\nVgQeR04NaJ2dyzwiTWdPFte215J8OIliu4rNoItUdAJ9yARuQg2vtZ8Lg87R3JD7L9nnw9q\r\nV9b6+nhHwlJewz/6LdW0ksga3eQGU7mBAZlHQDr/FXdXfwD8DX4n+06Gk7T3P2yV3lcs8wL\r\nEOTu6jecenHoK7jTdOh0qyitYAwijGF3HcfXkmtnVv9lE8pjeBtGutD0maC7sNN06VpzJ5e\r\nlszRsNqjc25V+bgg8dAK6OkFLWUnzO40raH/9k=\"/></img>',
    '</msg>'
  ].join(' ');

  var text = utils.xml2text(xml);

  var expected = 'asdfasdf' + '[猪头]' +
    'fasdfasdf' +
    ' http://www.baidu.com ' +
    '[表情]' +
    '『回复:--;这里是回复的内容』' +
    '<img src="data/images/thumb/md5sum.gif" />' +
    '<img src="data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg" />';

  test.equal(text, expected);
  test.done();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
