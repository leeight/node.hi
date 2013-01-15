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
var inet = require('./inet');
var model = require('./model');
var constant = require('./constant');
var logger = require('./logger').getLogger(__filename);

// mockup baidu hi client
var client = {
  user: {
    imid: 16897023      // leeight
  },
  getImageManager: function() {
    return {
      current: function() {
        // leeight给linuxracer发送的一个截图
        var image = new model.Image('6332596B7B37B2A971A1D7FA506A3F48',
          constant.IMAGE_CHAT, "jpg");
        image.direction = constant.IMAGE_IS_DOWN;
        return image;

        // leeight的头像
        var image = new model.Image('691e568b132ffddfc478d619cc397e16',
          constant.IMAGE_HEAD, "gif");
        return image;
      }
    }
  }
};
logger.debug(client.getImageManager().current());

// 某次回话中得到的信息，希望能一直有用
var ip = "220.181.111.39";
var port = 443;

var instance = new inet.ImageNetworkManager(client);
instance.start(ip, port);


















/* vim: set ts=4 sw=4 sts=4 tw=100: */
