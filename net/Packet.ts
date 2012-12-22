///<reference path="PacketHead.ts" />
///<reference path="Message.ts" />
///<reference path="HandshakeHead.ts" />
///<reference path="HandshakeBody.ts" />
///<reference path="Protocol.ts" />
///<reference path="../Utils.ts" />

class Packet {
  static keepAlive: Packet = new Packet(PacketHead.HEARTBEAT, null, null);
  public message: Message;
  constructor(public packetHead?: PacketHead, public handshakeHead?: HandshakeHead,
              public handshakeBody?: HandshakeBody) {

  }

  getBytes(): Int8Array {
    var result: Int8Array = null;
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
