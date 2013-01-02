/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/contact_query_response.js ~ 2013/01/02 11:52:28
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');
var model = require('../model');
var constant = require('../constant');

function ContactQueryResponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);

  /**
   * @type {Array.<model.Friend>}
   */
  this.friends = [];

  if (this.xml) {
    this.create();
  }
}
base.inherits(ContactQueryResponse, base_response.BaseResponse);

/**
 * "<contact_set>\n    <contact imid=\"32353201\" baiduid=\"yaoasm\" personal_comment=\"\" nickname=\"\" head=\"\" name=\"\" birthday=\"1980-2-24\" personal_desc=\"\" sex=\"2\" cli_type=\"0\" email=\"yaoasm1@126.com\" status=\"5\" email_fixed=\"1\" timestamp=\"1\" />\n    <contact imid=\"346518627\" baiduid=\"wangminsy001\" personal_comment=\"F5-B187 6058-0425  ;;wangmin02@baidu.com;;求UE\" nickname=\"王敏\" head=\"1e82e5a0e0bd1081cf2b5a99e9b1cd93;20120822100544;png\" name=\"\" birthday=\"0-0-0\" personal_desc=\"\" sex=\"2\" cli_type=\"0\" email=\"wangm1800@163.com\" status=\"5\" email_fixed=\"1\" timestamp=\"73\" />\n    <contact imid=\"16897023\" baiduid=\"leeight\" personal_comment=\"\" nickname=\"\" head=\"691e568b132ffddfc478d619cc397e16;20121106180725;gif\" name=\"李玉北\" birthday=\"2008-3-31\" personal_desc=\"\" sex=\"1\" cli_type=\"0\" email=\"liyubei@baidu.com\" status=\"5\" email_fixed=\"1\" timestamp=\"191\" />\n    <contact imid=\"327616233\" baiduid=\"panjun0108\" personal_comment=\"已离职 msn: panjun108@gmail.com\" nickname=\"潘军\" head=\"\" name=\"\" birthday=\"0-0-0\" personal_desc=\"\" sex=\"1\" cli_type=\"0\" email=\"panjun@baidu.com\" status=\"5\" email_fixed=\"1\" timestamp=\"23\" />\n</contact_set>\n"
 */
ContactQueryResponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml.replace(/\u0000/g, ''));
  var root = doc.documentElement;

  for(var i = 0, j = root.childNodes.length; i < j; i ++) {
    var contact = root.childNodes[i];
    if (contact.nodeType === 1 &&
        contact.nodeName === 'contact') {
      var friend = new model.Friend();
      friend.imid = parseInt(contact.getAttribute('imid'), 10);
      friend.baiduid = contact.getAttribute('baiduid');
      friend.personal_comment = contact.getAttribute('personal_comment');
      friend.nickname = contact.getAttribute('nickname');
      friend.name = contact.getAttribute('name');
      friend.birthday = contact.getAttribute('birthday');
      friend.personal_desc = contact.getAttribute('personal_desc');
      friend.email = contact.getAttribute('email');
      friend.status = parseInt(contact.getAttribute('status'), 10) || constant.USER_STATUS_ONLINE;
      friend.sex = parseInt(contact.getAttribute('sex'), 10) || 0;
      friend.client_type = parseInt(contact.getAttribute('cli_type'), 10) || 0;
      friend.timestamp = parseInt(contact.getAttribute('timestamp'), 10) || 0;

      // FIXME(leeight) friend.validated
      friend.validated = constant.CHATER_STATUS_FRIEND;

      var head = contact.getAttribute('head');
      if (head) {
        var chunks = head.split(';');
        if (chunks.length === 3) {
          friend.avatar = chunks[0] + '.' + chunks[2];
        } else {
          friend.avatar = '';
        }
      } else {
        friend.avatar = '';
      }

      this.friends.push(friend);
    }
  }
}





exports.ContactQueryResponse = ContactQueryResponse;















/* vim: set ts=4 sw=4 sts=4 tw=100: */
