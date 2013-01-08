/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/channel.js ~ 2013/01/08 23:12:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
define(function(){
  var handlers = {};
  function on(type, callback) {
    handlers[type] = callback;
  }

  window.addEventListener('message', function(e){
    var payload = e.data;
    var type = payload.type;
    var data = payload.data;
    if (handlers[type]) {
      handlers[type].call(null, data);
    }
  }, false);

  return {
    on: on
  };
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
