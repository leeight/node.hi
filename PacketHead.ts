import Protocol = module("./Protocol");

export class PacketHead {
  static S1: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_CON_S1, 0, 0, 0);
  static S2: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_CON_S2, 0, 0, 0);
  static S3: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_CON_S3, 0, 0, 0);
  static S4: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_CON_S4, 0, 0, 0);
  
  static MESSAGE: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_CON_OK, 0, 0, 0);
  static HEARTBEAT: PacketHead = new PacketHead(Protocol.ECtFlagConnectStates.CT_FLAG_KEEPALIVE, 0, 0, 0);

  /** 协议版本，当前版本为 #BIN_PRO_VER_1_0 **/
  private nVer: number[] = [0, 0, 1, 0];
  
  /** 标记，参考 #CT_TAG **/
  private nTag: string = Protocol.ProtocolConstant.CT_TAG;
  
  /** 是否加密,0--不加密;1--加密 **/
  public bEncrypt: number = 1;
  /** 是否压缩算法,0--不压缩;1--压缩 **/
  public bCompress: number = 1;
  /** 客户端告诉服务器是否应该发送心跳，服务器表示一个心跳包 **/
  public bHeartBeat: number = 1;
  /** 保留使用 **/
  public nReserved26: number = 26;
  /** 发送标志, 参考 #ECtSendFlags **/
  public nSendFlag: number = Protocol.ECtSendFlags.CT_SEND_FLAG_LOGIN;
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

  getBytes(): number[] {
    return [];
  }

  createFromBytes(): PacketHead {
    return new PacketHead(0, 0, 0, 0);
  }
}