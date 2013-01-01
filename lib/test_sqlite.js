/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_sqlite.js ~ 2013/01/01 16:50:45
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var sqlite3 = require('sqlite3').verbose();
var logger = require('./logger').logger;

exports.testInit = function(test) {
  var db = new sqlite3.Database('db/friends.sqlite');
  db.serialize(function(){
    db.run('CREATE TABLE IF NOT EXISTS friends (id int(10), name VARCHAR(256))');
    var stmt = db.prepare('INSERT INTO friends VALUES (?, ?)');
    for(var i = 0; i < 10; i ++) {
      stmt.run([i, 'Friend ' + i]);
    }
    stmt.finalize();
    db.each('SELECT rowid, id, name FROM friends', function(err, row){
      logger.debug(row.rowid + ',' + row.id + ',' + row.name);
    });
  });
  db.close();
  test.done();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
