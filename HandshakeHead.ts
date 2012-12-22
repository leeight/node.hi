class HandshakeHead {
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

  getBytes(): Int8Array {
    return null;
  }
}
