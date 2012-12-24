///<reference path="../net/ProtocolType.ts" />
///<reference path="../net/NetManager.ts" />
///<reference path="../node/node.d.ts" />

class BaseCommand {

  private static SPACE = ' ';
  private static CHANGE_LINE = '\n';
  private static SEPARATED = "\r\n";
  private static SEMICOLON = ":";

  private static MESTHOD_KEY = "method:";
  private static CONTENT_LENGTH_KEY = "content-length";
  private static CONTENT_TYPE_KEY = "content-type";
  private static REQUEST = 'R';

  private static CONTENT_TYPE_TEXT = "text";

  private command: string;
  private superCommand: string;
  private version: string;
  
  public seq: number;

  public protocolType: string;

  public contentType: string = BaseCommand.CONTENT_TYPE_TEXT;
  public commandHead = {};
  private commandBody: string;

  constructor(superCommand: string, command: string, version: string) {
    this.superCommand = superCommand;
    this.command = command;
    this.version = version;
    this.protocolType = ProtocolType.valueOf(superCommand, command);
  }

  addCommandHead(key: string, value: string) {
    this.commandHead[key] = value;
  }

  private isNotEmpty(msg: string): bool {
    return msg != null && msg.trim().length != 0;
  }

  createCommand(): string {
    this.commandBody = this.createCommandBody();

    var sb = [];
    /* ---------- 构建请求头 ---------- */
    
    // login 4.1 R 23
    this.seq = NetManager.getNextId();
    
    sb.push(this.superCommand);
    sb.push(BaseCommand.SPACE);
    sb.push(this.version);
    sb.push(BaseCommand.SPACE);
    sb.push(BaseCommand.REQUEST);
    sb.push(BaseCommand.SPACE);
    sb.push(this.seq);
    sb.push(BaseCommand.CHANGE_LINE);

    // mesthod:login
    if (this.isNotEmpty(this.command)) {
      sb.push(BaseCommand.MESTHOD_KEY);
      sb.push(this.command);
      sb.push(BaseCommand.CHANGE_LINE);
    }
    if (this.isNotEmpty(this.commandBody)) {
      // content-length:123
      sb.push(BaseCommand.CONTENT_LENGTH_KEY);
      sb.push(BaseCommand.SEMICOLON);
      sb.push(Buffer.byteLength(this.commandBody, 'utf8'));
      sb.push(BaseCommand.CHANGE_LINE);

      // content-type:text
      sb.push(BaseCommand.CONTENT_TYPE_KEY);
      sb.push(BaseCommand.SEMICOLON);
      sb.push(this.contentType);
      sb.push(BaseCommand.CHANGE_LINE);
    }

    /* ---------- 其他请求头字段 ---------- */
    var keys = Object.keys(this.commandHead);
    for(var i = 0; i < keys.length; i ++) {
      sb.push(keys[i]);
      sb.push(BaseCommand.SEMICOLON);
      sb.push(this.commandHead[keys[i]]);
      sb.push(BaseCommand.CHANGE_LINE);
    }
    sb.push(BaseCommand.SEPARATED);

    /* ---------- 构建消息体 ---------- */
    if (this.isNotEmpty(this.commandBody)) {
      sb.push(this.commandBody);
    }

    return sb.join('');
  }

  createCommandBody(): string {
    return '';
  }

}
