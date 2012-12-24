///<reference path="HandshakeHead.ts" />
///<reference path="Protocol.ts" />
///<reference path="../node/node.d.ts" />

export module net {

  export class S1Data extends net.HandshakeHead {
    /** 交换秘钥协议版本 当前版本为1 **/
    nEPVer: number = 1;

    /**
    * 压缩加密方法
    */
    nConMethod: Buffer = ProtocolConstant.CON_METHOD_A;

    getBytes(): Buffer {
      return new Buffer([]);
      /*
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      DataOutputStream dos = new DataOutputStream(out);
      try {
        dos.write(this.nEPVer);
        dos.write(this.nConMethod);
        dos.write(Utils.int2ByteArray(this.nReserved1));
        dos.write(Utils.int2ByteArray(this.nReserved2));
        dos.write(Utils.int2ByteArray(this.nDataLen));
        dos.flush();
      } catch (IOException e) {
        e(TAG, "", e);
      }
      return out.toByteArray();
      */
    }
  }

}
