///<reference path="HandshakeHead.ts" />

class S2Data extends HandshakeHead {
  /**
   * 会话策略
   */
  public nConMethod: number;
  /**
   * RootKey编号
   */
  public nRootKeyNO: number;
  /**
   * RootKey长度
   */
  public nRootKeyLen: number;

  getBytes(): Int8Array {
    return new Int8Array(0);
    /*
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    DataOutputStream dos = new DataOutputStream(out);
    try {
      dos.write(this.nConMethod);
      dos.write(this.nRootKeyNO);
      dos.write(Utils.int2ByteArray(this.nRootKeyLen));
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

  static createFromBytes(data: Int8Array): S2Data {
    return new S2Data();
    /*
    DataInputStream dis = new DataInputStream(new ByteArrayInputStream(data));
    S2Data result = new S2Data();
    try {
      result.nConMethod = dis.readByte();
      result.nRootKeyNO = dis.readByte();
      result.nRootKeyLen = Utils.getInt(dis);
      result.nReserved1 = Utils.getInt(dis);
      result.nReserved2 = Utils.getInt(dis);
      result.nDataLen = Utils.getInt(dis);
    } catch (IOException e) {
      e(TAG, "", e);
    }

    return result;
    */
  }

}
