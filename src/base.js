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
  for(var p in source) {
    if (source.hasOwnProperty(p)) {
      if (typeof target[p] === 'undefined') {
        target[p] = source[p];
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




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
