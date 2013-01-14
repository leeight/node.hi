/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * image_manager.js ~ 2013/01/14 21:26:20
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base = require('./base');
var model = require('./model');

/**
 * @constructor
 */
function ImageManager() {
  /**
   * @type {model.Image}
   */
  this._current;
}
base.addSingletonGetter(ImageManager);

ImageManager.prototype.current = function() {
  return this._current;
}


exports.ImageManager = ImageManager;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
