///<reference path="HandshakeHead.ts" />

class S3Data extends HandshakeHead {
  getBytes(): Int8Array {
    return new Int8Array(0);/*
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    DataOutputStream dos = new DataOutputStream(out);
    try {
      dos.write(Utils.int2ByteArray(this.nReserved1));
      dos.write(Utils.int2ByteArray(this.nReserved2));
      dos.write(Utils.int2ByteArray(this.nDataLen));
      dos.flush();
    } catch (IOException e) {
      e(TAG, "", e);
    }
    return out.toByteArray();*/
  }

  static createFromBytes(data: Int8Array): S3Data {
    return new S3Data();
    /*
    DataInputStream dis = new DataInputStream(new ByteArrayInputStream(data));
    S3Data result = new S3Data();
    try {
      result.nReserved1 = dis.readInt();
      result.nReserved2 = dis.readInt();
      result.nDataLen = dis.readInt();
    } catch (IOException e) {
      e(TAG, "", e);
    }

    return result;
    */
  }
}
