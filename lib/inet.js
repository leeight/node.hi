/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * inet.js ~ 2013/01/11 15:39:58
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  Image Network Manager
 **/
var events = require('events');
var base = require('./base');
var utils = require('./utils');
var constant = require('./constant');
var protocol = require('./protocol');
var logger = require('./logger').getLogger(__filename);

/**
 * @param {Client} client
 */
function ImageNetworkManager(client) {
  events.EventEmitter.call(this);

  /**
   * @type {Socket}
   */
  this._socket;

  /**
   * @type {Client}
   */
  this._client = client;

  /**
   * @type {Buffer}
   */
  this._bytes;

  this.on('new_packet', this.onNewPacket.bind(this));
}
base.inherits(ImageNetworkManager, events.EventEmitter);

/**
 * @param {string} ip
 * @param {int} port
 * @param {Buffer=} opt_token
 */
ImageNetworkManager.prototype.start = function(ip, port, opt_token) {
  if (this._socket) {
    throw new Error("Can't call twice");
  }

  var socket = require('net').createConnection(port, ip);
  socket.on('data', this._onSocketData.bind(this));
  socket.on('close', this._onSocketClose.bind(this));
  socket.on('error', this._onSocketError.bind(this));
  socket.on('connect', this._onSocketConnect.bind(this));
  socket.on('end', function () {
    logger.debug('socket closing...');
  });
  socket.setKeepAlive(true, 1000);

  this._socket = socket;
}

ImageNetworkManager.prototype._onSocketClose = function() {
  logger.warn('the server closed this socket. info = [%s]', base.toString(arguments));
}

ImageNetworkManager.prototype._onSocketError = function() {
  logger.error('socket error. info = [%s]', base.toString(arguments));
}

ImageNetworkManager.prototype._onSocketConnect = function() {
  logger.debug('ImageNetworkManager._onSocketConnect');
  var imid = this._client.user.imid;
  var token = new Buffer(4);
  token.writeInt32LE(imid, 0);

  var image = this._client.getImageManager().current();

  if (image) {
    if (image.type === constant.IMAGE_CHAT) {
      logger.debug('Start (downloading|uploading) IMAGE_CHAT');
      logger.debug(base.toString(image));

      var header = new protocol.RequestHeader(constant.RequestHeader.OTHER_IMAGE_AUTH, imid);
      var packet = new protocol.ImagePacket();
      packet.setHeader(header);
      packet.setToken(token);
      this.send(packet);
    } else if (image.type === constant.IMAGE_HEAD) {
      logger.debug('start downloading IMAGE_HEAD');
      logger.debug(base.toString(image));

      var header = new protocol.RequestHeader(constant.RequestHeader.DISPLAY_IMAGE_AUTH, imid);
      var packet = new protocol.ImagePacket();
      packet.setHeader(header);
      packet.setToken(token);
      this.send(packet);
    }
  } else {
    logger.warn('Not found any image object');
    this.finish();
  }
}

ImageNetworkManager.prototype._onSocketData = function(bytes) {
  logger.debug('ImageNetworkManager.prototype._onSocketData');
  if (this._bytes && this._bytes.length > 0) {
    this._bytes = Buffer.concat(
      [this._bytes, bytes],
      this._bytes.length + bytes.length);
  } else {
    this._bytes = bytes;
  }

  logger.debug('receiving data, length = [' + this._bytes.length + ']');
  // logger.debug(utils.dumpBuffer(this._bytes));

  this.decode();
}

/**
 * ImageDecoder.java
 */
ImageNetworkManager.prototype.decode = function() {
  logger.debug('ImageNetworkManager.prototype.decode');

  var bufferSize = this._bytes.length;
  var packetHeadLength = constant.ProtocolConstant.REQUESTER_HEAD_LENGTH;
  var imageInfoLength = 40;

  if (bufferSize < packetHeadLength) {
    // 太小了, 包头都不够
    logger.error('bufferSize = [' + bufferSize + '], packetHeadLength = [' +
      packetHeadLength + ']');
    return false;
  }

  var head = protocol.RequestHeader.createFromBytes(this._bytes);
  logger.debug(base.toString(head));

  switch(head.serviceType) {
    case constant.RequestHeader.DISPLAY_IMAGE_AUTH_RESP:
    case constant.RequestHeader.EMOTION_IMAGE_AUTH_RESP:
    case constant.RequestHeader.OTHER_IMAGE_AUTH_RESP: {
      logger.debug('head.serviceType = [%s]', head.serviceType);

      // 没有后续数据的
      var length = 4;
      var packetSize = packetHeadLength + length;
      if (bufferSize < packetSize) {
        logger.error('bufferSize = [%s], packetHeadLength = [%s], length = [%s]',
          bufferSize, packetHeadLength, length);
        return false;
      }

      var buffer = new Buffer(this._bytes.slice(packetHeadLength, packetSize));
      this._bytes = this._bytes.slice(packetSize);

      var packet = protocol.ImagePacketFactory.getInstance().create(head, null, buffer);
      this.emit('new_packet', packet);
      break;
    }

    case constant.RequestHeader.UPLOAD_DISPLAY_IMAGE_RESP:
    case constant.RequestHeader.UPLOAD_OTHER_IMAGE_RESP:
    case constant.RequestHeader.UPLOAD_EMOTION_IMAGE_RESP:
    case constant.RequestHeader.QUERY_DISPLAY_IMAGE_RESP:
    case constant.RequestHeader.QUERY_OTHER_IMAGE_RESP:
    case constant.RequestHeader.QUERY_EMOTION_IMAGE_RESP: {
      logger.debug('head.serviceType = [%s]', head.serviceType);

      var packetSize = packetHeadLength + imageInfoLength;
      if (bufferSize < packetSize) {
        // 还是太小, 没有收到整个包
        logger.error('bufferSize = [%s], imageInfoLength = [%s], packetHeadLength = [%s]',
          bufferSize, imageInfoLength, packetHeadLength)
        return false;
      }

      var imageRes = protocol.ImageResponse.createFromBytes(this._bytes.slice(packetHeadLength, packetSize));
      var packet = protocol.ImagePacketFactory.getInstance().create(head, imageRes);
      this._bytes = this._bytes.slice(packetSize);
      this.emit('new_packet', packet);
      break;
    }

    default: {
      logger.debug('head.serviceType = [%s]', head.serviceType);

      // DOWNLOAD_DISPLAY_IMAGE_RESP
      // DOWNLOAD_EMOTION_IMAGE_RESP
      // DOWNLOAD_OTHER_IMAGE_RESP
      var packetSize = packetHeadLength + imageInfoLength;
      if (bufferSize < packetSize) {
        // 还是太小, 没有收到整个包
        logger.error('bufferSize = [%s], imageInfoLength = [%s], packetHeadLength = [%s]',
          bufferSize, imageInfoLength, packetHeadLength)
        return false;
      }

      var imageRes = protocol.ImageResponse.createFromBytes(this._bytes.slice(packetHeadLength, packetSize));
      var length = imageRes.len;

      packetSize += length;
      if (bufferSize < packetSize) {
        // 还没有收到足够的后续数据
        logger.warn('There is no enough image data, total size is [%s], current is [%s]',
          length, (bufferSize - packetHeadLength - imageInfoLength));
        return false;
      }

      var buffer = new Buffer(this._bytes.slice(packetHeadLength + imageInfoLength, packetSize));
      this._bytes = this._bytes.slice(packetSize);

      var packet = protocol.ImagePacketFactory.getInstance().create(head, imageRes, buffer);
      this.emit('new_packet', packet);
      break;
    }
  }

  // RequestHeader (36)
  // ImageResponse (40 | 4) (depends on the RequestHeader)
  // raw data (depends on the ImageResponse)

  if (this._bytes.length > 0) {
    this.decode();
  }
}

ImageNetworkManager.prototype.finish = function() {
  if (this._socket) {
    this._socket.end();
  }
  this.emit('finish');
}

/**
 * @param {ImagePacket} packet
 */
ImageNetworkManager.prototype.onNewPacket = function(packet) {
  logger.debug('ImageNetworkManager.prototype.onNewPacket');
  logger.debug(base.toString(packet));

  // 得到当前要处理的图片对象.
  var image = this._client.getImageManager().current();

  switch(packet.header.serviceType) {
    case constant.RequestHeader.DISPLAY_IMAGE_AUTH_RESP: {
      if (packet.result === constant.IMAGE_RESULT_SUCCESS) {
        logger.debug('DISPLAY_IMAGE_AUTH_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        var header = new protocol.RequestHeader(constant.RequestHeader.DOWNLOAD_DISPLAY_IMAGE,
          packet.header.imid);
        var info = new protocol.ImageRequest(image.md5);
        var getImagePacket = new protocol.ImagePacket();
        getImagePacket.setHeader(header);
        getImagePacket.setImageInfo(info);
        this.send(getImagePacket);
      } else {
        logger.warn('DISPLAY_IMAGE_AUTH_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        this.finish();
      }
      break;
    }

    case constant.RequestHeader.EMOTION_IMAGE_AUTH_RESP: {
      if (packet.result === constant.IMAGE_RESULT_SUCCESS) {
        logger.debug('EMOTION_IMAGE_AUTH_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        var header = new protocol.RequestHeader(constant.RequestHeader.DOWNLOAD_EMOTION_IMAGE,
          packet.header.imid);
        var info = new protocol.ImageRequest(image.md5);
        var getImagePacket = new protocol.ImagePacket();
        getImagePacket.setHeader(header);
        getImagePacket.setImageInfo(info);
        this.send(getImagePacket);
      } else {
        logger.warn('EMOTION_IMAGE_AUTH_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        this.finish();
      }
      break;
    }

    case constant.RequestHeader.OTHER_IMAGE_AUTH_RESP: {
      if (packet.result === constant.IMAGE_RESULT_SUCCESS) {
        logger.debug('OTHER_IMAGE_AUTH_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        if (image.direction === constant.IMAGE_IS_UP) {
          // 需要上传图片
          var fs = require('fs');
          if (!image.localFile || !fs.existsSync(image.localFile)) {
            logger.error('Invalid image localFile = [%s]', image.localFile);
            break;
          }

          var header = new protocol.RequestHeader(constant.RequestHeader.QUERY_OTHER_IMAGE,
            packet.header.imid);
          header.to_id = image.to_id;

          var info = new protocol.ImageRequest(image.md5);
          info.len = fs.statSync(image.localFile).size;

          var upImagePacket = new protocol.ImagePacket();
          upImagePacket.setHeader(header);
          upImagePacket.setImageInfo(info);
          this.send(upImagePacket);
        } else if (image.direction === constant.IMAGE_IS_DOWN) {
          // 需要下载图片
          var header = new protocol.RequestHeader(constant.RequestHeader.DOWNLOAD_OTHER_IMAGE,
            packet.header.imid);
          var info = new protocol.ImageRequest(image.md5);
          var getImagePacket = new protocol.ImagePacket();
          getImagePacket.setHeader(header);
          getImagePacket.setImageInfo(info);
          this.send(getImagePacket);
        }
      } else {
        logger.warn('OTHER_IMAGE_AUTH_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        this.finish();
      }
      break;
    }

    case constant.RequestHeader.DOWNLOAD_OTHER_IMAGE_RESP:
    case constant.RequestHeader.DOWNLOAD_DISPLAY_IMAGE_RESP: {
      this.finish();
      if (packet.imageRes.result === constant.IMAGE_RESULT_FAIL) {
        logger.error('DOWNLOAD_OTHER_IMAGE_RESP|DOWNLOAD_DISPLAY_IMAGE_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        // TODO
      } else {
        logger.debug('DOWNLOAD_OTHER_IMAGE_RESP|DOWNLOAD_DISPLAY_IMAGE_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        // TODO
      }
      break;
    }

    case constant.RequestHeader.UPLOAD_OTHER_IMAGE_RESP: {
      this.finish();
      if (packet.imageRes.result === constant.IMAGE_RESULT_FAIL) {
        logger.error('UPLOAD_OTHER_IMAGE_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        // TODO
      } else {
        logger.debug('UPLOAD_OTHER_IMAGE_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        // TODO
      }
      break;
    }

    case constant.RequestHeader.QUERY_OTHER_IMAGE_RESP: {
      if (packet.result === constant.IMAGE_RESULT_SUCCESS) {
        // 上传图片的时候
        // 1. 发送OTHER_IMAGE_AUTH
        // 2. 处理OTHER_IMAGE_AUTH_RESP
        // 3. 发送QUERY_OTHER_IMAGE
        // 4. 处理QUERY_OTHER_IMAGE_RESP
        // 5. 发送UPLOAD_OTHER_IMAGE
        // 6. 处理UPLOAD_OTHER_IMAGE_RESP
        logger.debug('QUERY_OTHER_IMAGE_RESP:IMAGE_RESULT_SUCCESS:[%s]', image.md5);
        logger.debug(base.toString(packet.imageRes));

        var header = new protocol.RequestHeader(constant.RequestHeader.UPLOAD_OTHER_IMAGE,
          packet.header.imid);
        header.to_id = image.to_id;

        var imageFileSize = require('fs').statSync(image.localFile).size;
        if (imageFileSize > constant.IMAGE_MAX_UPLOAD_SIZE) {
          logger.error("Image file size [%s] is over than MAX_UPLOAD_SIZE [%s], please send it by file transfer service.",
            imageFileSize, constant.IMAGE_MAX_UPLOAD_SIZE);
          break;
        }

        var info = new protocol.ImageRequest(image.md5);
        info.pos = 0;
        info.len = imageFileSize;

        var upImagePacket = new protocol.ImagePacket();
        upImagePacket.setHeader(header);
        upImagePacket.setImageInfo(info);
        upImagePacket.setLocalFile(image.localFile);

        this.send(upImagePacket);
      } else {
        logger.warn('QUERY_OTHER_IMAGE_RESP:IMAGE_RESULT_FAIL:[%s]', image.md5);
        this.finish();
      }
      break;
    }
  }
}

/**
 * @param {ImagePacket} packet
 */
ImageNetworkManager.prototype.send = function(packet) {
  logger.debug('ImageNetworkManager.prototype.send');

  var bytes = packet.getBytes();
  if (!bytes || bytes.length <= 0) {
    logger.error('Invalid bytes, too small');
    return;
  }

  // logger.debug(utils.dumpBuffer(bytes));
  logger.debug('socket.write bytes = [%s] is [%s]',
    bytes.length, this._socket.write(bytes));
}






exports.ImageNetworkManager = ImageNetworkManager;












/* vim: set ts=4 sw=4 sts=4 tw=100: */
