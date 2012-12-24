class VerifyCodeType {
  static VerifyCodeUnknown = (0);
  /** 登录验证码，需要携带lid **/
  static VerifyCodeLogin = (1);
  /** 添加好友，需要携带friend **/
  static VerifyCodeAddFriend = (2);
  /** 删除好友 **/
  static VerifyCodeDeleteFriend = (3);
  /** 转让群 **/
  static VerifyCodeTransferGroup = (4);
  /** 创建群 **/
  static VerifyCodeCreateGroup = (5);
  /** 发送站内消息 **/
  static VerifyCodeSendBaiduMsg = (6);
  /** 解散群，服务器统计以判断用户是否可以解散群，客户端不判断是否需要出验证码 **/
  static VerifyCodeDisbandGroup = (7);
  /** 加入群 **/
  static VerifyCodeJoinGroup = (8);
  /** 退出群 **/
  static VerifyCodeQuitGroup = (9);
  /** 发送 email **/
  static VerifyCodeSendEmail = (10);
  /** 发送临时会话消息，需要携带uid2 **/
  static VerifyCodeTmpSession = (11);

  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }
}