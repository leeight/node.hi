export class HandshakeBody {
  public keyData: number[];

  getLength(): number {
    if (this.keyData != null) {
      return this.keyData.length;
    } else {
      return 0;
    }
  }
}