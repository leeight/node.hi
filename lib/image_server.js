/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * image_server.js ~ 2013/01/17 22:34:30
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * Image Http Server
 * 基本的原理是从IMAGE SERVER来拉去数据，然后通过HTTP的方式
 * 对外提供接口，方便Chrome Apps展示图片和用户头像。
 * test_inet.js里面已经基本实现了核心的代码，可以参考一下。
 **/
var http = require('http');
var url = require('url');
var fs = require('fs');
var inet = require('./inet');
var constant = require('./constant');
var model = require('./model');
var logger = require('./logger').getLogger(__filename);

var mimeMaps = {
  'gif': 'image/gif',
  'jpeg': 'image/jpg',
  'jpg': 'image/jpg',
  'png': 'image/png'
};

function invalidRequest(res, opt_detail) {
  res.writeHead(403, {'Content-Type': 'text/plain'});
  res.end('Invalid request.' + (opt_detail || '') + '\n');
}

function notFound(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not found.\n');
}

function sendFile(res, md5, contentType) {
  res.writeHead(200, {'Content-Type': contentType});
  fs.readFile(md5, function(err, buffer){
    if (err) {
      notFound(res);
      return;
    }
    res.end(buffer);
  });
}

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;

  // 1. md5 (....)
  // 2. ext (gif | png | jpg)
  // 3. type (IMAGE_CHAT | IMAGE_HEAD)
  if (!query.md5 || !query.ext | !query.type || !mimeMaps[query.ext]) {
    invalidRequest(res, "missing parameters.");
    return;
  }

  var type = parseInt(query.type, 10);
  if (type !== constant.IMAGE_CHAT &&
      type !== constant.IMAGE_HEAD) {
    invalidRequest(res, "invalid type.");
    return;
  }

  var md5 = query.md5.toLowerCase();
  if (md5.length != 32 || !/^[a-z0-9]{32}$/.test(md5)) {
    invalidRequest(res, "invalid md5.");
  }

  var ext = query.ext;
  var contentType = mimeMaps[ext];
  if (fs.existsSync(md5)) {
    logger.debug('Using local cache to sendFile');
    sendFile(res, md5, contentType);
    return;
  }

  var client = {
    user: {
      imid: 16897023      // leeight
    },
    getImageManager: function() {
      return {
        current: function() {
          // leeight的头像
          var image = new model.Image(md5, type, ext);
          image.direction = constant.IMAGE_IS_DOWN;
          return image;
        }
      }
    }
  };

  var ip = "220.181.111.39";
  var port = 443;
  var instance = new inet.ImageNetworkManager(client);
  instance.start(ip, port);

  instance.on('finish', function(){
    if (fs.existsSync(md5)) {
      logger.debug('Using remote cache to sendFile');
      sendFile(res, md5, contentType);
    } else {
      logger.error('Fetch remote cache failed');
      notFound(res);
    }
  });
}).listen(1337, '127.0.0.1');
logger.debug('Server running at http://127.0.0.1:1337/');



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
