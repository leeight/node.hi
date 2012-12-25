/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * security.js ~ 2012/12/23 20:25:59
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

var ursa = require('ursa');
var utils = require('./utils');

var PUBKEY_PREFIX = new Buffer([
  0x30,0x81,0x9F,0x30,0x0D,0x06,0x09,0x2A,
  0x86,0x48,0x86,0xF7,0x0D,0x01,0x01,0x01,
  0x05,0x00,0x03,0x81,0x8D,0x00
]);

/**
 * @param {Buffer} keyData
 * @param {ursa.PublicKey} key
 */
exports.decodeDataToKey = function(keyData, key) {
  var d1 = new Buffer(keyData.slice(0, 128));
  var d2 = new Buffer(keyData.slice(128, 256));

  var r1 = key.publicDecrypt(d1);
  var r2 = key.publicDecrypt(d2);

  /*
  console.log(r1);
  console.log(r1.toString('base64'));
  console.log(r1.length);
  console.log(r2);
  console.log(r2.toString('base64'));
  console.log(r2.length);
  */

  var rv = utils.sumArray(r1, r2);
  /*
  console.log(rv);
  console.log(rv.toString('base64'));
  console.log(rv.length);
  */

  var pem = new Buffer(162);
  PUBKEY_PREFIX.copy(pem, 0);
  rv.copy(pem, PUBKEY_PREFIX.length);

  var buffer = pem.toString('base64');
  var pemText = [
    '-----BEGIN PUBLIC KEY-----',
    buffer.substr(64 * 0, 64),
    buffer.substr(64 * 1, 64),
    buffer.substr(64 * 2, 64),
    buffer.substr(64 * 3),
    '-----END PUBLIC KEY-----',
  ].join('\n');
  // console.log(pemText);

  return ursa.createPublicKey(pemText);
}

/**
 * @param {string} pem
 */
exports.publicKey = function(pem) {
  return ursa.createPublicKey(pem);
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
