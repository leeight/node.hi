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
var base = require('./base');
var persist = require("persist");
var type = persist.type;

Friend = persist.define('friends', {
  imid: type.INTEGER,
  status: type.INTEGER,
  personal_comment: type.STRING,
  personal_desc: type.STRING,
  avatar: type.STRING
});

exports.testCreateTable = function(test) {
  persist.connect({
    driver: 'sqlite3',
    filename: 'data/db/friends.sqlite',
    trace: true
  }, function(err, connection){
    model.Model.createTable(Friend, connection, function(err, data){
      Friend.deleteAll(connection, function(err){
        if (err) {
          throw err;
        }
        test.done();
        connection.close();
      });
    });
  });
}

exports.testFriend = function(test) {
  persist.connect({
    driver: 'sqlite3',
    filename: 'data/db/friends.sqlite',
    trace: true
  }, function(err, connection){
    if (err) {
      throw err;
    }

    for(var i = 0; i < 10; i ++) {
      var friend = new Friend();
      friend.imid = 8964 + i;
      friend.status = 1;
      friend.personal_comment = 'personal_comment' + i;
      friend.personal_desc = 'personal_desc' + i;
      friend.avatar = 'avatar' + i;
      console.log(base.toString(friend));
      friend.save(connection, function(err){
        if (err) {
          throw err;
        }
      });
    }
    test.done();
    connection.close();
  });
}

exports.testSaveAndUpdate = function(test) {
  persist.connect({
    driver: 'sqlite3',
    filename: 'data/db/friends.sqlite',
    trace: true
  }, function(err, connection){
    if (err) {
      throw err;
    }
    Friend.where('imid = ?', 8964).first(connection, function(err, friend){
      if (err) {
        throw err;
      }

      if (!friend) {
        throw new Error('can\'t find friend');
      }

      test.equal(friend.imid, 8964);
      test.equal(friend.personal_comment, 'personal_comment0');
      test.equal(friend.personal_desc, 'personal_desc0');
      test.equal(friend.status, 1);
      test.equal(friend.avatar, 'avatar0');

      friend.personal_comment = '新的personal_comment';
      friend.save(connection, function(err){
        if (err) {
          throw err;
        }

        Friend.where('imid = ?', 8964).first(connection, function(err, again){
          if (err) {
            throw err;
          }
          test.equal(again.personal_comment, '新的personal_comment');
          test.done();
          connection.close();
        });
      });
    });
  });
}

/*
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
}*/





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
