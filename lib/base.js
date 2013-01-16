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

function type(instance) {
  if (instance === null) {
    return null;
  }

  if (Buffer.isBuffer(instance)) {
    return 'Buffer';
  }

  var t = Object.prototype.toString.call(instance);
  return t.replace(/\[object |\]/g, '');
}

/**
 * 格式化Packet的信息.
 * @param {Object}
 */
exports.toString = function(instance) {
  if (instance) {
    var message = ['[protocol.' + (instance.constructor.name || '<unknown>') + ']'];
    Object.getOwnPropertyNames(instance).forEach(function(key){
      var t = type(instance[key]);
      if (t) {
        switch(t) {
          case 'Function':
            message.push('[' + key + ' = <function>]');
            break;
          case 'Buffer':
          case 'Array':
            message.push('[' + key + ' = ' + Array.prototype.join.call(instance[key], ',') + ']');
            break;
          case 'Object':
            message.push('[' + key + ' = ' + exports.toString(instance[key]) + ']');
            break;
          default:
            message.push('[' + key + ' = ' + instance[key] + ']');
            break;
        }
      } else {
        message.push('[' + key + ' = <empty>]');
      }
    });
    return message.join(':');
  } else {
    return '<empty>';
  }
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
