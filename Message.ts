class Message {
  message: string;

  constructor(public data: Int8Array) {
  }


  getBytes(): Int8Array {
    if (this.message == null) {
      return this.data;
    }
    // FIXME
    return new Int8Array([0]);
    // return this.message.getBytes();
  }
}
