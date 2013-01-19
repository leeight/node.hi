/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * assets/js/friends.js ~ 2013/01/06 21:39:06
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

define(function(){

/**
 * key => imid
 * value => {lib.model.Friend}
 * @type {Object.<string, Object>}
 */
var _friends = {};

/**
 * 添加好友的信息.
 * @param {Object} friend 好友.
 */
function add(friend) {
  if (friend['imid']) {
    _friends[friend['imid']] = friend;
  }
}

/**
 * @type {string} imid
 */
function find(imid) {
  return _friends[imid] || null;
}

/**
 * TODO 支持拼音?
 * 按照关键词搜索, 返回一批好友
 * @param {string} query 搜索关键词.
 * @param {number=} opt_max 最多返回多少个?
 * @return {Array.<Object>}
 */
function search(query, opt_max) {
  var max = opt_max || 20;
  var friends = [];

  for(var key in _friends) {
    if (_friends.hasOwnProperty(key)) {
      var friend = _friends[key];
      var weight = _isMatch(friend, query);
      if (weight > 0) {
        friends.push([weight, friend]);
        if (friends.length >= max) {
          break;
        }
      }
    }
  }

  return friends.sort(function(a, b){
    return b[0] - a[0];
  }).map(function(a){
    return a[1];
  });
}

/**
 * 按照一定规则展示某些好友.
 * 因为没有必要展示全部的, 如果想跟某个人聊天, 去搜索就好了.
 * @return {Array.<Object>}
 */
function getTopFriends() {
  var friends = [];
  for(var imid in _friends) {
    if (_friends.hasOwnProperty(imid)) {
      var friend = _friends[imid];
      if (friend['status'] <= 3) {
        friends.push(friend);
      }
    }
  }
  return friends;
}

/**
 * @param {Object} friend 好友信息.
 * @param {string} query 关键词.
 * @return {number} 0没有找到, 否则返回符合的权重用来呈现UI
 * 的时候进行排序.
 */
function _isMatch(friend, query) {
  if (!friend) {
    return 0;
  }

  var keyword = query.toLowerCase();
  var weight = 0;
  var attributes = [
    'baiduid',
    'personal_comment',
    'name',
    'nickname',
    'new_username'
  ];
  var size = attributes.length;

  for(var i = 0, key = null; key = attributes[i++]; ) {
    if (friend[key] && (friend[key].toLowerCase()).indexOf(keyword) > -1) {
      weight += (size - i ) * (size - i);
    }
  }

  return weight;
};














return {
  add: add,
  find: find,
  search: search,
  getTopFriends: getTopFriends
}


});
/* vim: set ts=4 sw=4 sts=4 tw=100: */
