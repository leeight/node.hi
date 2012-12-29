/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * response/user_query_response.js ~ 2012/12/29 14:25:15
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var base_response = require('./base_response');
var base = require('../base');
var logger = require('../logger').logger;

/**
 * @param {BaseResponse} father
 */
function UserQueryReponse(father) {
  base_response.BaseResponse.call(this);
  base.mixin(this, father);
  this._user = {};
  if (this.xml) {
    this.create();
  }
}
base.inherits(UserQueryReponse, base_response.BaseResponse);

UserQueryReponse.prototype.getUser = function() {
  return this._user;
}

/**
 * <user uid="20079852">
 * <account baiduid="Lucifer52xue"
 *          personal_comment="y3##(#d9到时候好伤心很喜欢十九世纪手机电视基督教我问问你到家加拿大刚到家豆浆机小姐很纠结呼吸机先进性九鼎记多久饭ijkfkfcet刚开学喝好几回和谐不及格好好学习天天向上回电话好像"
 *          birthday="1982-8-25"
 *          email=""
 *          head="6bd038f40d79bffab19a1b7af3560b54;丹顶鹤;jpg"
 *          name=""
 *          nickname=""
 *          phone=""
 *          sex="1"
 *          email_fixed="0" />
 * </user>
 */
UserQueryReponse.prototype.create = function() {
  var DOMParser = require('xmldom').DOMParser;
  var doc = new DOMParser().parseFromString(this.xml);
  var user = doc.documentElement;
  var account = user.getElementsByTagName('account')[0];

  this._user['imid'] = parseInt(user.getAttribute('uid'), 10) || 0;
  this._user['account'] = account.getAttribute('baiduid');
  this._user['birthday'] = account.getAttribute('birthday');
  this._user['email'] = account.getAttribute('email');
  this._user['name'] = account.getAttribute('name');
  this._user['nickname'] = account.getAttribute('nickname');
  this._user['personal_comment'] = account.getAttribute('personal_comment');
  this._user['phone'] = account.getAttribute('phone');
  this._user['sex'] = parseInt(account.getAttribute('sex'), 10) || 0;

  var head = account.getAttribute('head');
  if (head) {
    var chunks = head.split(';');
    if (chunks.length === 3) {
      this._user['avatar'] = chunks[0] + '.' + chunks[2];
    } else {
      logger.warn('invalid account avatar info = [' + head + ']');
    }
  } else {
    logger.warn('no account avatar');
  }
}

exports.UserQueryReponse = UserQueryReponse;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
