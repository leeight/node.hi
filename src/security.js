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
var crypto = require('crypto');
var utils = require('./utils');
var logger = require('./logger').logger;

var PUBKEY_PREFIX = new Buffer([
  0x30,0x81,0x9F,0x30,0x0D,0x06,0x09,0x2A,
  0x86,0x48,0x86,0xF7,0x0D,0x01,0x01,0x01,
  0x05,0x00,0x03,0x81,0x8D,0x00
]);

var AES_ALGORITHM = 'aes-128-ecb';

function format(msg) {
  return msg.replace(/^----.*/gm, '').replace(/\r?\n/g, '');
}
/**
 * 长度为2的Buffer数组.
 * @return {Array.<Buffer>}
 */
exports.getKeyPair = function() {
  var pair = ursa.generatePrivateKey(1024);

  // pubkey和prikey本身已经是PEM格式了, 注意去掉换行之类的东东

  // XXX pubkey是有前缀的, 为了保证140个字节, 需要去掉前缀
  var pubkey = format(pair.toPublicPem().toString('ascii'));

  // 让Buffer自动解码
  var k1 = new Buffer(pubkey, 'base64').slice(PUBKEY_PREFIX.length);

  // XXX prikey是没有前缀的, 自己用, 不需要搞那么复杂.
  var prikey = format(pair.toPrivatePem().toString('ascii'));
  var k2 = new Buffer(prikey, 'base64');

  return [k1, k2, pair];
}

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

/**
 * 按照我的理解, 应该就是把PUBKEY_PREFIX的前缀去掉即可.
 * @param {Buffer} bytes
 */
exports.getASN1PublicKey = function(bytes) {
  return new Buffer(bytes.slice(PUBKEY_PREFIX.length));
}

/**
 * @type {Buffer}
 */
var MD5_SEED = null;

/**
 * @param {Buffer} md5_seed
 */
exports.setMd5Seed = function(md5_seed) {
  MD5_SEED = new Buffer(md5_seed);
}

var AES_KEY = null;

/**
 * @param {Buffer} aes_key
 */
exports.setAesKey = function(aes_key) {
  logger.warn(aes_key);
  AES_KEY = new Buffer(aes_key);
}


/**
 * @param {Buffer} encryptedData 加密的数据.
 * @param {int} length 解密之后的长度.
 */
exports.AESDecrypt = function(encryptedData, length) {
  var decipher = crypto.createDecipheriv(AES_ALGORITHM, AES_KEY, "");
  decipher.setAutoPadding(false);
  var first = new Buffer(decipher.update(encryptedData, 'binary', 'binary'), 'binary');
  var last = new Buffer(decipher.final('binary'), 'binary');

  var buffer = new Buffer(first.length + last.length);
  buffer.fill(0);
  first.copy(buffer, 0, 0, first.length);
  last.copy(buffer, first.length, 0, last.length);

  // FIXME(leeight) 校验长度是否正确
  if (buffer.length != length) {
    return buffer.slice(0, length);
  }

  /*
  {
  if (buffer.length > length) {
    var tmp = new Buffer(buffer.length - length);
    buffer.copy(tmp, 0, length);
    var flag = false;
    for(var i = 0; i < tmp.length; i ++) {
      if (tmp[i] != 0) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      console.log(flag);
    } else {
      console.log(tmp);
    }
  }
  throw new Error('AESDecrypt failed, dst length = [' + length +
    '], buffer length = [' + buffer.length + ']');
  }
  */

  return buffer;
}

/**
 * @param {Buffer|string} bytes
 */
exports.AESEncrypt = function(bytes) {
  if (!Buffer.isBuffer(bytes)) {
    bytes = new Buffer(bytes, 'utf-8');
  }

  var cipher = crypto.createCipheriv(AES_ALGORITHM, AES_KEY, "");
  // cipher.setAutoPadding(true);

  var first = new Buffer(cipher.update(bytes, 'binary', 'binary'), 'binary');
  var last = new Buffer(cipher.final('binary'), 'binary');

  var buffer = new Buffer(first.length + last.length);
  first.copy(buffer, 0, 0, first.length);
  last.copy(buffer, first.length, 0, last.length);

  return buffer;
}

/**
 * @param {string} password
 * @return {string}
 */
exports.encryptPassword = function(password) {
  if (!MD5_SEED) {
    // 没有握手成功?
    return '';
  }

  var md5sum = crypto.createHash('md5');
  md5sum.update(password, 'utf-8');

  var z = md5sum.digest('hex');
  var first = new Buffer(z);
  var second = utils.sumArray(first, MD5_SEED);

  md5sum = crypto.createHash('md5');
  md5sum.update(second);

  return md5sum.digest('hex');
}

/**
 * @param {Buffer} zipedData 压缩之后的数据.
 * @param {int} length 解压缩之后的长度.
 * @param {Function} callback
 */
exports.decompressData = function(zipedData, length, callback) {
  var zlib = require('zlib');
  zlib.inflate(zipedData, function(err, buffer){
    if (err) {
      throw err;
    }

    if (buffer.length != length) {
      // FIXME(leeight) 如何处理呢?
      // return null;
    }

    callback(buffer);
  });
}

/**
 * @param {Buffer|string} bytes
 * @param {Function} callback
 */
exports.compressData = function(bytes, callback) {
  if (!Buffer.isBuffer(bytes)) {
    bytes = new Buffer(bytes, 'utf-8');
  }
  var zlib = require('zlib');
  var deflate = zlib.createDeflate({
    level: zlib.Z_BEST_COMPRESSION
  });

  var output = [];
  var size = 0;
  deflate.on('error', function(){
    deflate.removeAllListeners();
    deflate = null;
  });
  deflate.on('data', function(chunk){
    output.push(chunk);
    size += chunk.length;
  });
  deflate.on('end', function(){
    var buffer;
    switch(output.length) {
      case 0:
        buffer = new Buffer(0);
        break;
      case 1:
        buffer = output[0];
        break;
      default:
        buffer = new Buffer(size);
        var offset = 0;
        output.forEach(function(chunk){
          chunk.copy(buffer, offset, 0, chunk.length);
          offset += chunk.length;
        });
        break;
    }
    callback(buffer);
  });
  deflate.write(bytes);
  deflate.end();
}


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
