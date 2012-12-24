///<reference path="node/node.d.ts" />

import constant = module('constant');
import Utils = module('Utils');
var ECtFlagConnectStates = constant.constant.ECtFlagConnectStates;
var ProtocolConstant = constant.constant.ProtocolConstant;
var ECtSendFlags = constant.constant.ECtSendFlags;

export module protocol {

  export class HandshakeHead {
    /**
    * 保留字段，目前为0
    */
    nReserved1: number = 0;
    /**
    * 保留字段，目前为0
    */
    nReserved2: number = 0;
    /**
    * 后续数据长度
    */
    nDataLen: number = 0;

    getBytes(): Buffer {
      return null;
    }
  }

  export class HandshakeBody {
    keyData: Buffer;

    getLength(): number {
      if (this.keyData != null) {
        return this.keyData.length;
      } else {
        return 0;
      }
    }
  }

  export class S1Data extends HandshakeHead {
    /** 交换秘钥协议版本 当前版本为1 **/
    nEPVer: number = 1;

    /**
    * 压缩加密方法
    */
    nConMethod: number[] = ProtocolConstant.CON_METHOD_A;

    getBytes(): Buffer {
      // 1: nEPVer
      // 4: nConMethod
      // 4: nReserved1
      // 4: nReserved2
      // 4: nDataLen

      var bytes = new Buffer(17);
      bytes.fill(0);
      bytes.writeInt8(this.nEPVer, 0);
      bytes.writeInt8(this.nConMethod[0], 1);
      bytes.writeInt8(this.nConMethod[1], 2);
      bytes.writeInt8(this.nConMethod[2], 3);
      bytes.writeInt8(this.nConMethod[3], 4);
      bytes.writeInt32LE(this.nReserved1, 4);
      bytes.writeInt32LE(this.nReserved2, 8);
      bytes.writeInt32LE(this.nDataLen, 12);

      return bytes;
    }
  }


  export class PacketHead {
    static S1: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S1, 0, 0, 0);
    static S2: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S2, 0, 0, 0);
    static S3: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S3, 0, 0, 0);
    static S4: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S4, 0, 0, 0);

    static MESSAGE: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_OK, 0, 0, 0);
    static HEARTBEAT: PacketHead = new PacketHead(ECtFlagConnectStates.CT_FLAG_KEEPALIVE, 0, 0, 0);

    /** 协议版本，当前版本为 #BIN_PRO_VER_1_0 **/
    private nVer: Buffer = new Buffer([0, 0, 1, 0]);

    /** 标记，参考 #CT_TAG **/
    private nTag: string = ProtocolConstant.CT_TAG;

    /** 是否加密,0--不加密;1--加密 **/
    public bEncrypt: number = 1;
    /** 是否压缩算法,0--不压缩;1--压缩 **/
    public bCompress: number = 1;
    /** 客户端告诉服务器是否应该发送心跳，服务器表示一个心跳包 **/
    public bHeartBeat: number = 1;
    /** 保留使用 **/
    public nReserved26: number = 26;
    /** 发送标志, 参考 #ECtSendFlags **/
    public nSendFlag: number = ECtSendFlags.CT_SEND_FLAG_LOGIN;
    /** 协议种类，暂为0 **/
    public nCategory: number = 0;
    /** 保留字段 **/
    public nReserved1: number = 0;
    /** 保留字段 **/
    public nReserved2: number = 0;

    /** 会话状态标示，参考 #ECtFlagConnectStates **/
    public ctFlag: number;
    /** 原始数据长度 **/
    public nSrcDataLen: number;
    /** 压缩后数据长度 **/
    public nZipDataLen: number;
    /** 加密后数据长度 **/
    public nDestDataLen: number;

    constructor(ctFlag: number, nSrcDataLen: number,
                nZipDataLen: number, nDestDataLen: number) {
      this.ctFlag = ctFlag;
      this.nSrcDataLen = nSrcDataLen;
      this.nZipDataLen = nZipDataLen;
      this.nDestDataLen = nDestDataLen;
    }

    getBytes(): Buffer {
      return new Buffer([]);
    }

    createFromBytes(): PacketHead {
      return new PacketHead(0, 0, 0, 0);
    }
  }

  export class Message {
    message: string;

    constructor(public data?: Buffer) {
    }

    getBytes(): Buffer {
      if (this.message == null) {
        return this.data;
      }
      return new Buffer(this.message);
    }
  }

  export class Packet {
    static keepAlive: Packet = new Packet(PacketHead.HEARTBEAT, null, null);
    public message: Message;
    constructor(public packetHead?: PacketHead, public handshakeHead?: HandshakeHead,
                public handshakeBody?: HandshakeBody) {

    }

    getBytes(): Buffer {
      var result: Buffer = null;
      var ctFlag: number = this.packetHead.ctFlag;

      switch (ctFlag) {
        case ECtFlagConnectStates.CT_FLAG_CON_S1:
          result = Utils.sumArray(this.packetHead.getBytes(),
            this.handshakeHead.getBytes());
          break;
        case ECtFlagConnectStates.CT_FLAG_CON_S2:
          break;
        case ECtFlagConnectStates.CT_FLAG_CON_S3:
          result = Utils.sumArray(this.packetHead.getBytes(),
            this.handshakeHead.getBytes());
          if (this.handshakeBody == null) {
            return null;
          }
          result = Utils.sumArray(result, this.handshakeBody.keyData);
          break;
        case ECtFlagConnectStates.CT_FLAG_CON_S4:
          break;
        case ECtFlagConnectStates.CT_FLAG_CON_OK:
          result = Utils.sumArray(this.packetHead.getBytes(),
            this.message.getBytes());
          break;
        case ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
          result = this.packetHead.getBytes();
          break;
        default:
          break;
      }

      return result;
    }
  }
}
