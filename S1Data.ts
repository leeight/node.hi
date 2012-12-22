///<reference path="HandshakeHead.ts" />
///<reference path="Protocol.ts" />

class S1Data extends HandshakeHead {
  /** 交换秘钥协议版本 当前版本为1 **/
  public nEPVer: number = 1;

  /**
   * 压缩加密方法
   */
  public nConMethod: Int8Array = ProtocolConstant.CON_METHOD_A;

  getBytes(): Int8Array {
    return new Int8Array(0);
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
