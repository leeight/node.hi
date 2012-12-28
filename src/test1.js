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
var asn1 = require('./asn1');
// var der = 'MIGJAoGBALeOGqvBvEC0Ta2ZYm998FXxPKZNh/krDjFYVH6iT6oOzJgTPo/rvTC9RuUsgmpgi5dtQi/1ZiXjp7Fl4qsEkx4fVL3W9DK+jgnam2vw5GtrpECrQjV022UkJRu4AWajWE91H/b4V9WU7FI15T+j+Q5jmxeAWSTQKRW5xoreRN1lAgMBAAE=';
var der = [48,129,137,2,129,129,0,183,142,26,171,193,188,64,180,77,173,153,98,111,125,240,85,241,60,166,77,135,249,43,14,49,88,84,126,162,79,170,14,204,152,19,62,143,235,189,48,189,70,229,44,130,106,96,139,151,109,66,47,245,102,37,227,167,177,101,226,171,4,147,30,31,84,189,214,244,50,190,142,9,218,155,107,240,228,107,107,164,64,171,66,53,116,219,101,36,37,27,184,1,102,163,88,79,117,31,246,248,87,213,148,236,82,53,229,63,163,249,14,99,155,23,128,89,36,208,41,21,185,198,138,222,68,221,101,2,3,1,0,1];
var pbk = asn1.ASN1.decode(der).toHexDOM();
console.log(pbk);
*/

/*
var pem = [
'-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTax1kRYFi6oM0piwathvPXsYI',
'vyZNTVoWxQfYB3PTCzkZj9wTgiUvZKJ80//g5NYXWX9NCRoGXriRqFyvT19wiCkC',
'kUER6YuXtb5jgq5hzeVTDsRjuHfs5yQxGzRzg2UeB87EnaUPUhjEse62iSXnRCG6',
'9CD+g4J1oIgO0dZlHQIDAQAB',
'-----END PUBLIC KEY-----'
].join('\n');

var ursa = require('ursa');
var pubkey = ursa.createPublicKey(pem);
console.log(pubkey);
console.log(pubkey.getExponent());
console.log(pubkey.getModulus());
process.exit(0);
*/

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

security.setMd5Seed(new Buffer([1,2,3]));
console.log(security.encryptPassword("leeight"));
console.log(security.encryptPassword("你好"));

security.compressData('hello world, 你好世界', function(zipedData){
  console.log(zipedData.length);
  console.log(zipedData);

  security.decompressData(zipedData, zipedData.length, function(original){
    console.log(original);
    console.log(original.toString('utf-8'));
    console.log(original.length);
  });
});


console.log('== hello world ==');
security.setAesKey([1,2,3,4,5,6,7]);
var z = security.AESEncrypt("hello world, 你好世界");
console.log(z);
var k = security.AESDecrypt(z);
console.log(k);
console.log(k.toString('utf-8'));
















/* vim: set ts=4 sw=4 sts=4 tw=100: */
