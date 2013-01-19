/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ui.js ~ 2013/01/18 16:09:34
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
define('ui', ['../debug', '../channel'], function(debug, channel){
  /** @type {Object.<string, Window>} */
  var _windowsCache = {};

  function addCache(id, w) {
    _windowsCache[id] = w;
    // FIXME(leeight)
    // channel.connect(w.opener, w);
    w.onclose = function() {
      delete _windowsCache[id];
    }
  }

  var createWindow = debug.isLocal() ? function(url, options, opt_callback) {
    var callback = opt_callback || function(){};
    var features = 'width=' + options.width + ',height=' + options.height;
    var w = _windowsCache[url];
    if (!w || w.closed) {
      w = window.open(url, url, features);
      if (!w) {
        alert('createWindow failed.');
        callback(null);
        return;
      } else {
        addCache(url, w);
      }
    }
    w.focus();
    callback(w);
  } : function(url, options, opt_callback) {
    var callback = opt_callback || function(){};
    var w = _windowsCache[url];
    if (w && !w.closed) {
      w.focus();
      callback(w);
    } else {
      chrome.app.window.create(url, options, function(w){
        if (w) {
          w.focus();
          addCache(url, w.contentWindow);
          callback(w.contentWindow);
        }
      });
    }
  };

  function createChatWindow(url, opt_callback) {
    var options = {'width': 445, 'height': 400};
    createWindow(url, options, opt_callback);
  }

  function findChatWindow(windowId) {
    console.log(_windowsCache);
    return _windowsCache[windowId];
  }

  return {
    createWindow: createWindow,
    findChatWindow: findChatWindow,
    createChatWindow: createChatWindow
  }
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
