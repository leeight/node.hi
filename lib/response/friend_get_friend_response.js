/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/friend_get_friend_response.js ~ 2013/01/01 20:35:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');
var model = require('../model');

function FriendGetFriendResponse(father) {
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
base.inherits(FriendGetFriendResponse, base_response.BaseResponse);

/**
 * "<friend_set>\n\t<friend imid=\"16897023\" team=\"0\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"32353201\" team=\"240\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"327616233\" team=\"0\" validated=\"1\" monicker=\"\" />\n\t<friend imid=\"346518627\" team=\"0\" validated=\"1\" monicker=\"\" />\n</friend_set>\n"
 */
FriendGetFriendResponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml.replace(/\u0000/g, ''));
  var root = doc.documentElement;

  for(var i = 0, j = root.childNodes.length; i < j; i ++) {
    var node = root.childNodes[i];
    if (node.nodeType === 1 &&
        node.nodeName === 'friend') {
      var friend = new model.Friend();
      friend.imid = parseInt(node.getAttribute('imid'), 10);
      friend.team = parseInt(node.getAttribute('team'), 10);
      friend.validated = parseInt(node.getAttribute('validated'), 10);
      friend.monicker = node.getAttribute('monicker') || '';
      this.friends.push(friend);
    }
  }
}

exports.FriendGetFriendResponse = FriendGetFriendResponse;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
