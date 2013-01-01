/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/contact_notify_response.js ~ 2012/12/31 15:45:40
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');
var model = require('../model');
var constant = require('../constant');
var logger = require('../logger').logger;

function ContactNotifyResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {model.Friend}
   */
  this.friend = new model.Friend();

  if (this.xml) {
    this.create();
  }
}
base.inherits(ContactNotifyResponse, base_response.BaseResponse);

/**
 * <contact imid=\"114960740\" status=\"1;\" has_camera=\"0\" music=\"\" psp_status=\"0\" cli_type=\"4\" />
 */
ContactNotifyResponse.prototype.create = function() {
  logger.debug('ContactNotifyResponse.prototype.create');
  logger.debug(JSON.stringify(this.xml));

  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml);
  var contact = doc.documentElement;

  this.friend.imid = parseInt(contact.getAttribute('imid'), 10) || 0;
  this.friend.status = parseInt(contact.getAttribute('status'), 10) || constant.USER_STATUS_ONLINE;
  this.friend.personal_comment = contact.getAttribute('personal_comment');
  this.friend.nickname = contact.getAttribute('nickname');
  this.friend.name = contact.getAttribute('name');
  this.friend.birthday = contact.getAttribute('birthday');
  this.friend.personal_desc = contact.getAttribute('personal_desc');
  this.friend.sex = parseInt(contact.getAttribute('sex'), 10) || 0;
  this.friend.client_type = parseInt(contact.getAttribute('cli_type'), 10) || 0;
  this.friend.timestamp = parseInt(contact.getAttribute('timestamp'), 10) || 0;
  this.friend.email = contact.getAttribute('email');
  this.friend.has_camera = parseInt(contact.getAttribute('has_camera'), 10) || 0;
  this.friend.music = contact.getAttribute('music');
  this.friend.psp_status = parseInt(contact.getAttribute('psp_status'), 10) || 0;

  var avatar = contact.getAttribute('avatar');
  this.friend.avatar = avatar;
  if (avatar) {
    var chunks = avatar.split(";");
    if (chunks.length === 3) {
      this.friend.avatar = chunks[0] + '.' + chunks[2];
    }
  }
}

exports.ContactNotifyResponse = ContactNotifyResponse;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
