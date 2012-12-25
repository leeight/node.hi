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

var pem =
'-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0jOkMXcDm9YMYoHFZ9B4orS+Xe9oE3En0yQA0QPeZqSo9/XUfTEoIOulpG/WGn3Mt8Jn1gPOE59yZ8gCRBakSPxWocIXx/7fM4DLHcq0VupZ4h9x44+mV1bsbj7UPMyWaFGkD4NvxaMwL+nVZMfzazKDjdzFnh4+w1CByBPu6hwIDAQAB\n' +
//'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDa0umL0zBrCzcUi5aKDsz3o4xk\n' +
//'7D6Z8KyrrXRyEcozDhF0rx0OZBoRPdx8ojh+ga1sWiD+okpfHRCcqJ7aLxo5x6TK\n' +
//'UJ92LOxgTKAhZetHAcnLgy63r9bHzmxjGnToEDGxUT6zaHB+3CpxXJTioDBLeobe\n' +
//'SLxWiLu6lhWGkHzODQIDAQAB\n' +
//'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDvILjbhwk+bR5dnNA5214iVa+C\n' +
//'7cMLOc3JuC67PWllZhknV369SSuHhlFzrcV83/zCV0qC+URmocJYMBhC6kjOHi36\n' +
//'dHkm1KDo/DJ2IB7tet9JaJJA8e25vhhduhlxAK3SGmjNwA1drsu2BMvv8uoUnZpa\n' +
//'MkDwiojbz0J2XoM1RwIDAQAB\n' +
'-----END PUBLIC KEY-----';
console.log(pem);
var pubkey = ursa.createPublicKey(pem);
console.log(pubkey);
console.log(pubkey.getExponent());
console.log(pubkey.getModulus());


/*
for(var i = 0; i < constant.IM_RootPubKeyData_PEM.length; i ++) {
  var pem = constant.IM_RootPubKeyData_PEM[i];
  var pubkey = ursa.createPublicKey(pem);
  console.log(pubkey);
  console.log(pubkey.getExponent());
  console.log(pubkey.getModulus());
}*/



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
