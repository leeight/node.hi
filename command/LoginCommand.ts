///<reference path="BaseCommand.ts" />
///<reference path="../User.ts" />
///<reference path="../Utils.ts" />
///<reference path="../security/Handshake.ts" />
///<reference path="../node/node.d.ts" />

class LoginCommand extends BaseCommand {
  private v_url: string;
  private v_time: string;
  private v_period: string;
  private v_code: string;
  private user: User;

  constructor(url: string, time: string, period: string,
              code: string, user: User) {
    super("login", "login", "4.2");
    this.v_url = url;
    this.v_time = time;
    this.v_period = period;
    this.v_code = code;
    this.user = user;
    this.setCommandHead();
  }

  private setCommandHead() {
    this.addCommandHead("v_url", this.v_url);
    this.addCommandHead("v_time", this.v_time);
    this.addCommandHead("v_period", this.v_period);
    this.addCommandHead("v_code", this.v_code);
    this.addCommandHead("priority", this.user.priority + "");
  }

  createCommandBody(): string {
    var user = this.user;
    var xml = [];

    xml.push('<?xml version="1.0" encoding="UTF-8" ?>');
    xml.push('<login>');
    xml.push('<user');
    if (user.account) {
      xml.push(' account="' + user.account + '"');
    }
    if (user.password) {
      xml.push(' password="' + this.md5Password(user.password) + '"');
    }
    xml.push(' imversion="' + user.imversion + '"');
    xml.push(' redirect_times="' + user.redirectTimes + '"');
    xml.push(' priority="' + user.priority + '"');
    xml.push(' platform="' + user.platform + '"');
    xml.push(' client_type="' + user.client_type + '"');
    if (user.newUsername) {
      xml.push(' new_username="' + user.newUsername + '"'); 
    }
    xml.push('></user>');
    xml.push('</login>');

    return xml.join('');
  }

  private md5Password(password: string): string {
    if (Handshake.MD5_SEED == null) {
      return "";
    }

    // FIXME Buffer vs String
    var first = this.Md5(new Buffer(password));
    var temp = Utils.sumArray(first, Handshake.MD5_SEED);
    var result = this.Md5(temp);

    return result.toString();
  }

  private Md5(data: Buffer): Buffer {
    return new Buffer('hello');
    /*
    try {
      MessageDigest md = MessageDigest.getInstance("MD5");
      md.update(data);
      byte b[] = md.digest();
      int i;
      StringBuffer buf = new StringBuffer("");
      for (int offset = 0; offset < b.length; offset++) {
        i = b[offset];
        if (i < 0)
          i += 256;
        if (i < 16)
          buf.append("0");
        buf.append(Integer.toHexString(i));
      }
      return buf.toString().getBytes();
    } catch (NoSuchAlgorithmException e) {
      LogUtil.e(TAG, "", e);
      return null;
    }
    */
  }
}