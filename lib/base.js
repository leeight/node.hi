/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * base.js ~ 2012/12/23 11:15:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

exports.inherits = function (d, b) {
  require('util').inherits(d, b);
};

exports.mixin = function(target, source) {
  if (source) {
    for(var p in source) {
      if (source.hasOwnProperty(p)) {
        // if (typeof target[p] === 'undefined') {
          target[p] = source[p];
        // }
      }
    }
  }
  return target;
}

exports.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    return ctor.instance_ = new ctor;
  };
};

/**
 * 格式化Packet的信息.
 * @param {Object}
 */
exports.toString = function(instance) {
  if (instance) {
    var message = ['[protocol.' + (instance.constructor.name || '<unknown>') + ']'];
    Object.getOwnPropertyNames(instance).forEach(function(key){
      if (Object.prototype.toString.call(instance[key]) === '[object Object]') {
        if (Buffer.isBuffer(instance[key])) {
          message.push('[' + key + ' = ' + instance[key] + ']');
        } else {
          message.push('[' + key + ' = ' + exports.toString(instance[key]) + ']');
        }
      } else {
        message.push('[' + key + ' = ' + instance[key] + ']');
      }
    });
    return message.join(':');
  } else {
    return '<empty>';
  }
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
