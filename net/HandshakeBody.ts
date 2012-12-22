class HandshakeBody {
  public keyData: Int8Array;

  getLength(): number {
    if (this.keyData != null) {
      return this.keyData.length;
    } else {
      return 0;
    }
  }
}