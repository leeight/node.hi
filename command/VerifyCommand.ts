///<reference path="BaseCommand.ts" />
///<reference path="../net/VerifyCodeType.ts" />

class VerifyCommand extends BaseCommand {
  public uid: number;
  public lid: string;
  public friend: number;
  public uid2: number;

  public type: VerifyCodeType;

  constructor(type: VerifyCodeType, uid: number,
              lid: string, friendUid: number, uid2: number) {
    super("security", "verify", "1.0");
    this.uid = uid;
    this.lid = lid;
    this.friend = friendUid;
    this.uid2 = uid2;
    this.type = type;
    this.addCommandHead("uid2", String(uid2));
    this.setCommandHead();
  }

  private setCommandHead() {
    this.addCommandHead("uid", String(this.uid));
    this.addCommandHead("lid", this.lid);
    switch (this.type) {
      case VerifyCodeType.VerifyCodeLogin:
        break;
      case VerifyCodeType.VerifyCodeAddFriend:
        this.addCommandHead("friend", String(this.friend));
        break;
      default:
        break;
    }
    this.addCommandHead("type", String(this.type.getValue()));
  }
}