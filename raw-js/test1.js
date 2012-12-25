/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test1.js ~ 2012/12/24 22:50:20
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/


var ursa = require('ursa');
var constant = require('./constant');
var security = require('./security');

var pem =
'-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDa0umL0zBrCzcUi5aKDsz3o4xk\n' +
'7D6Z8KyrrXRyEcozDhF0rx0OZBoRPdx8ojh+ga1sWiD+okpfHRCcqJ7aLxo5x6TK\n' +
'UJ92LOxgTKAhZetHAcnLgy63r9bHzmxjGnToEDGxUT6zaHB+3CpxXJTioDBLeobe\n' +
'SLxWiLu6lhWGkHzODQIDAQAB\n' +
//'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDvILjbhwk+bR5dnNA5214iVa+C\n' +
//'7cMLOc3JuC67PWllZhknV369SSuHhlFzrcV83/zCV0qC+URmocJYMBhC6kjOHi36\n' +
//'dHkm1KDo/DJ2IB7tet9JaJJA8e25vhhduhlxAK3SGmjNwA1drsu2BMvv8uoUnZpa\n' +
//'MkDwiojbz0J2XoM1RwIDAQAB\n' +
'-----END PUBLIC KEY-----';
/*
console.log(pem);
var pubkey = ursa.createPublicKey(pem);
console.log(pubkey);
console.log(pubkey.getExponent());
console.log(pubkey.getModulus());
console.log(pubkey.encrypt("11111").length);
console.log(pubkey.encrypt(new Buffer([1,1,1,1,1])).length);
*/

/*
for(var i = 0; i < constant.IM_RootPubKeyData_PEM.length; i ++) {
  var pem = constant.IM_RootPubKeyData_PEM[i];
  var pubkey = ursa.createPublicKey(pem);
  console.log(pubkey);
  console.log(pubkey.getExponent());
  console.log(pubkey.getModulus());
}*/

/*
var keypair = ursa.generatePrivateKey(1024);
var pubkey = keypair.toPublicPem();
var prikey = keypair.toPrivatePem();
// pubkey 和 prikey 本身已经是PEM格式了
pubkey = pubkey.toString('ascii');
console.log(pubkey);
prikey = prikey.toString('ascii');
console.log(prikey.length);
*/
/*
console.log(pk.toString('base64'));
console.log(pk.length);
console.log(keypair.toPrivatePem().toString('base64'));
console.log(keypair.toPrivatePem().length);
*/

/*
var pair = security.getKeyPair();
var k1 = pair[0];
var k2 = pair[1];

console.log(k1);
console.log(k1.length);
console.log(k2.length);
*/

var zzz = ursa.generatePrivateKey(1024);
console.log(zzz.encrypt(new Buffer(100), undefined, undefined, 1).length);
console.log(zzz.encrypt(new Buffer(40) , undefined, undefined, 1).length);
















/* vim: set ts=4 sw=4 sts=4 tw=100: */
