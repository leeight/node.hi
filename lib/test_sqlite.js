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
var logger = require('./logger').getLogger(__filename);
var utils = require('./utils');

/*
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
*/

exports.testXml2Text2 = function(test) {
  var xml = [
    '<msg>',
      '<font n="宋体" s="10" b="0" i="0" ul="0" c="0" cs="134" />',
      '<text c="asdfasdf" />',
      '<face id="d58" n="猪头" />',
      '<text c="fasdfasdf" />',
      '<url c="http://www.baidu.com" />',
      '<cface />',
      '<reply t="1" c="这里是回复的内容"/>',
      '<img md5="md5sum" t="gif"><thumb thumbdata="base64data" /></img>',
      '<img md5=\"C32292865B15D051A847FA9F35D6091B\" t=\"jpg\" n=\"6068e22e-d05f-4386-9f1e-50485ce683d1\"><thumb thumbdata=\"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoM\r\nDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQs\r\nNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wA\r\nARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAt\r\nRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2Jy\r\nggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXq\r\nDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2u\r\nHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/\r\n8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAV\r\nYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ\r\n3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1d\r\nbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U65/x9Yw6n4M1izubVb23\r\nuLZ4Zbd5GjEiMMMpZeRkE9K6Cs/xBNDBo149wYhAI23mZgqYxzuLcY+tNCex84fCTxrbPda\r\nNHaaJFePrF1dSHUtOkmjjihjnfZvT5ycLtUk4UuGPHb5F+O/xX0Hwn8QdI8T+K4dRl06xu7\r\n6KMaQkckkZjAtkchyuVAPOGHzbRnkY+2/hP4Nu/hp4C0zRtIu9O1I6bFOt3PEgPmb5PM42v\r\nhDjIyd3b8fz9+NvgOD4x+PtI8ESzf2auqR3scdzOVUxyQ2kEiSYUlTueMA8n5Xb+Igq6vL0\r\n2OenfmjzPv+R9+/sNeNPDPjf4FW114U1yPX9NtLs2b3CwyQskqQwlkdHAKsAynAyMMCCc5r\r\n6Dr5g/4J5fAm2/Z8+COqeHrbXV8Qi716bUXuVjEYRnt7dNmAT0EQPXvX0/UJWVkbQtyrl2C\r\nue+INxFaeCtYuJ4o54obZpWjmxtYKN3OSB27kV0NYvjNoV8Kat9ouEtYWtpEaeQ4VAVIyTk\r\nevrVLdDlsz5n+DHjeXVvDnh6S00HTtRsNR0pr658R22nxW7AeQ7JI6xkrEW+QBScgHBA4r4\r\nh+Kvi7T9D+Kng3VtZ8Sf8ItZI9/N/arWsk3lv5UQQGJFPU4XJHGeRjNfoBosdn4G+C2i6BZ\r\nasl/pdlokGhfaoVU/aAIvKWQckAHBOAT9a/Or45WmjeKPinoNlrUYl01zqDumGIJVoyO2MZ\r\nXtz1orNO+mhzU37yu9k/yZ+i37CHinT/F3wh1a90zxLZ+KrVdcli+3WaSIARb252MrgFWAI\r\nOOmCK+j6+ZP+Cfdp4cs/gtqyeGbKKxszr07TJCgQNKYLf5sADnbsHTtX03WcFFRSirLsdEH\r\neKYVgeN4bmfw9cpBDps8ZRzOmrOVtzGEY/OQDxu259s/St+q+oWMWp2NxaXCloLiNopFBIJ\r\nVgQeR04NaJ2dyzwiTWdPFte215J8OIliu4rNoItUdAJ9yARuQg2vtZ8Lg87R3JD7L9nnw9q\r\nV9b6+nhHwlJewz/6LdW0ksga3eQGU7mBAZlHQDr/FXdXfwD8DX4n+06Gk7T3P2yV3lcs8wL\r\nEOTu6jecenHoK7jTdOh0qyitYAwijGF3HcfXkmtnVv9lE8pjeBtGutD0maC7sNN06VpzJ5e\r\nlszRsNqjc25V+bgg8dAK6OkFLWUnzO40raH/9k=\"/></img>',
    '</msg>'
  ].join(' ');

  var text = utils.xml2text(xml);

  var expected = 'asdfasdf' + '[猪头]' +
    'fasdfasdf' +
    ' http://www.baidu.com ' +
    '[表情]' +
    '『回复:--;这里是回复的内容』' +
    '<img src="data/images/thumb/md5sum.gif" />' +
    '<img src="data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg" />';

  test.equal(text, expected);
  test.done();
}


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
