/** 添加协议类型 YQH 20120720 **/
class ProtocolType {
  /** 验证码命令 **/
  static SECURITY_VERIFY = 'SECURITY_VERIFY';

  /** 登录命令 **/
  static LOGIN_LOGIN = 'LOGIN_LOGIN';
  /** 被踢出命令 **/
  static LOGIN_KICKOUT = 'LOGIN_KICKOUT';
  /** 登出命令 **/
  static LOGIN_LOGOUT = 'LOGIN_LOGOUT';

  static FRIEND_GET_FRIEND = 'FRIEND_GET_FRIEND';
  static FRIEND_GET_BLOCK = 'FRIEND_GET_BLOCK';
  static FRIEND_GET_TEAM = 'FRIEND_GET_TEAM';
  static FRIEND_SET = 'FRIEND_SET';
  static FRIEND_ADD = 'FRIEND_ADD';
  static FRIEND_ADD_ACK = 'FRIEND_ADD_ACK';
  static FRIEND_FIND = 'FRIEND_ADD_ACK';

  static GROUP_GET_LIST = 'GROUP_GET_LIST';
  /** 获取群成员列表 YQH 20120720 **/
  static GROUP_GET_MEMBER = 'GROUP_GET_MEMBER';
  /** 获取群消息策略 **/
  static GROUP_GET_MSG_SCHEME = 'GROUP_GET_MSG_SCHEME';
  /** 设置群消息策略 **/
  static GROUP_SET_MSG_SCHEME = 'GROUP_SET_MSG_SCHEME';
  static GROUP_GET = 'GROUP_GET';
  /** 退出群 YQH 20120720 **/
  static GROUP_GET_MONICKER = 'GROUP_GET_MONICKER';
  /** 获取群成员备注 YQH 20120720 **/
  static GROUP_QUIT = 'GROUP_QUIT';
  /** 临时会话 YQH 20120808 **/
  static MSG_TMSG_REQUEST = 'MSG_TMSG_REQUEST';
  static GROUP_JOIN_ACK = 'GROUP_JOIN_ACK';
  // GROUP_JOIN_ACK = null,
  static CONTACT_QUERY = 'CONTACT_QUERY';
  static GROUP_TRANSFER_ACK = 'GROUP_TRANSFER_ACK';
  static GROUP_FIND = 'GROUP_FIND';

  static TIMESTAMP_USER = 'TIMESTAMP_USER';

  static QUERY_OFFLINE_MSG_COUNT = 'QUERY_OFFLINE_MSG_COUNT';
  static QUERY_GET_OFFLINE_MSG = 'QUERY_GET_OFFLINE_MSG';

  static MSG_MSG_ACK = 'MSG_MSG_ACK';
  static MSG_MSG_REQUEST = 'MSG_MSG_REQUEST';

  static USER_QUERY = 'USER_QUERY';
  static USER_SET = 'USER_SET';
  static USER_LOGIN_READY = 'USER_LOGIN_READY';
  static USER_SET_ABILITY = 'USER_SET_ABILITY';

  static IMAGESVR_ = 'IMAGESVR_';
  static GROUP_ADD_MANAGER_NOTIFY = 'GROUP_ADD_MANAGER_NOTIFY';
  static GROUP_DELETE_MANAGER_NOTIFY = 'GROUP_DELETE_MANAGER_NOTIFY';
  static SET_ABILITY_ = 'SET_ABILITY_';

  static valueOf(superCommand: string, command: string): string {
    var value = (superCommand.trim().toUpperCase() + "_" + command.trim().toUpperCase());
    if (ProtocolType[value]) {
      return value;
    }
  }
}