/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_model.js ~ 2013/01/01 22:11:26
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var sqlite3 = require('sqlite3').verbose();
var model = require('./model');

exports.testFriend = function(test) {
  var friend = new model.Friend();
  friend.imid = 8964;
  friend.status = 1;
  friend.team = 0;
  friend.validated = 1;
  friend.sex = 0;
  friend.personal_comment = 'personal_comment';
  friend.personal_desc = 'personal_desc';
  friend.nickname = 'nickname';
  friend.monicker = 'monicker';
  friend.avatar = 'avatar';
  friend.name = 'name';
  friend.birthday = 'birthday';
  friend.email = 'email@baidu.com';
  friend.save();

  var db = new sqlite3.Database('db/friends.sqlite');
  db.serialize(function(){
    db.get('SELECT name FROM friends WHERE imid = ?', 8964, function(err, row){
      test.ok(row);
      test.equal(row.name, 'name');
    });

    db.close();
    test.done();
  });

  /*
  friend.personal_comment = 'personal_comment_2';
  friend.save();

  db.serialize(function(){
    db.get('SELECT name FROM friends WHERE imid = ?', 8964, function(err, row){
      test.ok(row);
      test.equal(row.name, 'name');
    });

    db.close();
    test.done();
  });
  */
}





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
