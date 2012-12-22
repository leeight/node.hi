export class Message {
  message: string;

  constructor(public data: number[]) {
  }


  getBytes(): number[] {
    if (this.message == null) {
      return this.data;
    }
    // FIXME
    return [];
    // return this.message.getBytes();
  }
}
