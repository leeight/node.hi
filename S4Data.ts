///<reference path="HandshakeHead.ts" />

class S4Data extends HandshakeHead {
  /** 随机key，本次连接期间用来对密码做hash **/
  public seed: Int8Array = new Int8Array(16);

  /** Keep-Alive间隔时间 **/
  public nKeepAliveSpace: number;

  /*
   * <ts_config><heartbeat sign_interval="40" echo_timeout="80"/></ts_config>
   */

  getBytes(): Int8Array {
    return new Int8Array(0);
    /*
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    DataOutputStream dos = new DataOutputStream(out);
    try {
      dos.write(Utils.int2ByteArray(this.nKeepAliveSpace));
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

  static createFromBytes(data: Int8Array): S4Data {
    return new S4Data();
    /*
    DataInputStream dis = new DataInputStream(new ByteArrayInputStream(data));
    S4Data result = new S4Data();
    try {

      dis.read(result.seed);
      result.nKeepAliveSpace = Utils.getInt(dis);
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
