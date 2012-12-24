///<reference path="../node/node.d.ts" />

class Message {
  message: string;

  constructor(public data?: Buffer) {
  }

  getBytes(): Buffer {
    if (this.message == null) {
      return this.data;
    }
    return new Buffer(this.message);
  }
}
