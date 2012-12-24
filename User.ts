///<reference path="Constant.ts" />

class User {
  static LOGIN = 1;
  static LOGOUT = 2;
  static QUIT = 0;

  /* **以下为登录时使用** */
  /** 客户端版本，格式类似2,3,5,7 **/
  imversion = "1,0,0,0";
  /** 登录优先级，请参考 LOGIN_PRIORITYS **/
  priority = 20;
  /** 客户端类型，请参考 ClientType **/
  client_type = 4;
  /** 客户端平台类型 **/
  platform = "android";
  /** 重定向次数 **/
  redirectTimes = "0";
  /** 登录用户名 **/
  account: string;
  /** 密码 **/
  password: string;
  /** 用户的帐号状态 **/
  userStatus = 1;
  /** 响应值为 484 进入无UN逻辑 时重新发送Login命令时使用。 **/
  newUsername: string;
  /** 是否保存密码 **/
  isRememberPassword: bool;
  /** 是否隐身登录 **/
  isHide: bool;
  /** 验证码 */
  vCode: string;
  /* **以下为登录成功后填充详细信息 ** */
  /** 当前账户的ID **/
  imid: number;
  /** 姓名 **/
  name: string;
  /** 昵称 **/
  nickname: string;
  /** 个性签名 **/
  personalComment: string;
  /** 性别 **/
  sex: number;
  /** 出生日期 **/
  birthday: string;
  /** 电话 **/
  phone: string;
  /** 邮箱 **/
  email: string;
  /** 用户头像 **/
  head: string;
  /** 成功登录时间 **/
  lastLoginTime = 0;
  /** 是否已经登录成功 **/
  isLogin: number;

  /**
   * 获取年龄
   */
  getAge(): string {
    // 计算年龄 2012-02-22
    if (this.birthday != null && this.birthday.trim().length != 0) {
      var nowYear = new Date().getFullYear();
      var temp = this.birthday.split("-");
      if (temp.length != 0) {
        var byear = parseInt(temp[0], 10);
        if (byear == 0) {
          return null;
        }
        return "" + (1900 + nowYear - byear);
      }
    }
    return null;
  }

  /**
   * 获取性别
   */
  getSex(): string {
    var ret;
    switch (this.sex) {
      case Constant.SEX_TYPE_MAN:
        ret = "男";
        break;
      case Constant.SEX_TYPE_WOMAN:
        ret = "女";
        break;
      default:
        ret = "";
        break;
    }
    return ret;
  }

  /**
   * 返回登录用户展示名称
   */
  getDisplayName(): string {
    if (this.nickname != null && this.nickname.length != 0) {
      return this.account;
    } else {
      return this.nickname;
    }
  }

  constructor(account?: string, password?: string) {
    this.account = account;
    this.password = password;
  }
}
