/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_inet.js ~ 2013/01/14 22:04:15
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 测试一下图片下载的功能
 **/
var fs = require('fs');
var path = require('path');
var inet = require('./inet');
var model = require('./model');
var constant = require('./constant');
var security = require('./security');
var logger = require('./logger').getLogger(__filename);

// 某次回话中得到的信息，希望能一直有用
var ip = "220.181.111.39";
var port = 443;

exports.testImageCreate = function(test) {
  var instance = model.Image.create("data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg", 8964);
  test.equal(instance.md5, "c93970628d9a87d3207f366acd1427e6");
  test.equal(instance.ext, "jpg");
  test.equal(instance.type, constant.IMAGE_CHAT);
  test.equal(instance.localFile, "data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg");
  test.equal(instance.to_id, 8964);
  test.done();
}

exports.testUploadImage = function(test) {
  var to_id = 16897023;       // leeight
  var from_id = 114960740;    // linuxracer
  // var image = model.Image.create("data/images/thumb/c32292865b15d051a847fa9f35d6091b.jpg", to_id);
  
  // 超过1M了，服务器直接关闭链接
  // 经过人肉测试，发现是1000K的时候，服务器直接关闭链接，不是1024K（所以上传图片的时候，需要注意一下）
  // var image = model.Image.create("data/images/thumb/2013-01-15 19.34.20.jpg", to_id);
  
  // 刚好1M，看看情况?
  var image = model.Image.create("data/images/thumb/null.jpg", to_id);

  // var image = model.Image.create("data/images/thumb/logo.gif", to_id);
  // var image = model.Image.create("a72f9c7027a5642e6feb1f80649df547.jpg", to_id);  // 168K

  var client = {
    user: {
      imid: from_id
    },
    getImageManager: function() {
      return {
        current: function() {
          return image;
        }
      }
    }
  };

  var instance = new inet.ImageNetworkManager(client);
  instance.start(ip, port);

  instance.on('finish', function(){
    test.done();
  });
}

exports.testFetchUserAvatar = function(test) {
  var md5 = '691e568b132ffddfc478d619cc397e16';

  var client = {
    user: {
      imid: 16897023      // leeight
    },
    getImageManager: function() {
      return {
        current: function() {
          // leeight的头像
          var image = new model.Image(md5, constant.IMAGE_HEAD, "gif");
          return image;
        }
      }
    }
  };

  var instance = new inet.ImageNetworkManager(client);
  instance.start(ip, port);

  instance.on('finish', function(){
    test.ok(fs.existsSync(md5));
    test.equal(security.md5sum(fs.readFileSync(md5)), md5);
    test.done();
    fs.unlinkSync(md5);
  });
}

exports.testFetchImageChat = function(test) {
  // var md5 = '6332596B7B37B2A971A1D7FA506A3F48'.toLowerCase();
  // var md5 = '1dbd9703a8721088e0cb777729171a4a';

  // leeight -> linuxracer的截图
  // var md5 = 'C50C353FD19DA3D344DA359370DED93F'.toLowerCase();
  var md5 = 'A72F9C7027A5642E6FEB1F80649DF547'.toLowerCase();

  var client = {
    user: {
      imid: 16897023      // leeight
    },
    getImageManager: function() {
      return {
        current: function() {
          // leeight给linuxracer发送的一个截图
          var image = new model.Image(md5, constant.IMAGE_CHAT, "jpg");
          image.direction = constant.IMAGE_IS_DOWN;
          return image;
        }
      }
    }
  };

  var instance = new inet.ImageNetworkManager(client);
  instance.start(ip, port);

  instance.on('finish', function(){
    test.ok(fs.existsSync(md5));
    test.equal(security.md5sum(fs.readFileSync(md5)), md5);
    test.done();
    fs.unlinkSync(md5);
  });
}


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
