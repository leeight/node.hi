/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * constant.js ~ 2012/12/23 10:56:40
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
exports.ECtFlagConnectStates = {
    CT_FLAG_CON_S1 : 0,                 // 会话第一步(握手)
    CT_FLAG_CON_S2 : 1,                 // 会话第二部(握手)
    CT_FLAG_CON_S3 : 2,                 // 会话第三部(握手)
    CT_FLAG_CON_S4 : 3,                 // 会话第四步(握手)
    CT_FLAG_KEEPALIVE : 37,             // 心跳包
    CT_FLAG_CON_OK : 31,                // 会话进入正常流程
    CT_FLAG_CON_OK_NOZIP_NOAES : 7,     // 正常会话-不压缩-不加密
    CT_FLAG_CON_OK_NOZIP_DOAES : 15,    // 正常会话-不压缩-要加密
    CT_FLAG_CON_OK_DOZIP_NOAES : 23     // 正常会话-要压缩-要加密
}

exports.ECtSendFlags = {
    CT_SEND_FLAG_HANDSHAKE : 0,
    CT_SEND_FLAG_LOGIN : 1,
    CT_SEND_FLAG_LOGOUT : 2,
}

exports.ProtocolConstant = {
    MAX_METHOD : 4,
    SYM_METHOD_NONE : 0,                // 无加密
    SYM_METHOD_AES : 1,                 // AES加密策略
    SYM_METHOD_DES : 2,                 // DES加密策略
    UNSYM_METHOD_NONE : 0,              // 无加密
    UNSYM_METHOD_RSA : 1,               // RSA加密策略
    ZIP_METHOD_NONE : 0,                // 无压缩
    ZIP_METHOD_COMPRESS : 1,            // zlib compress压缩
    CON_METHOD_NULL : 0,                // 非法数据
    CON_METHOD_NONE : 1,                // 无压缩, 无加密
    CON_METHOD_A : [2, 0, 0, 0],        // RSA交换密钥, AES加密 ZIP(compress)压缩
    CT_TAG : '1VMI',                    // ??
    BIN_PRO_VER_1_0 : 1,                // 1.0
    PAKECT_HEAD_LENGTH : 40             // pack_head (OnePacket) 长度
}

exports.VerifyCodeType = {
  VerifyCodeUnknown : 0,
  VerifyCodeLogin : 1,                  // 登录验证码，需要携带lid
  VerifyCodeAddFriend : 2,              // 添加好友，需要携带friend
  VerifyCodeDeleteFriend : 3,           // 删除好友
  VerifyCodeTransferGroup : 4,          // 转让群
  VerifyCodeCreateGroup : 5,            // 创建群
  VerifyCodeSendBaiduMsg : 6,           // 发送站内消息
  VerifyCodeDisbandGroup : 7,           // 解散群，服务器统计以判断用户是否可以解散群，客户端不判断是否需要出验证码
  VerifyCodeJoinGroup : 8,              // 加入群
  VerifyCodeQuitGroup : 9,              // 退出群
  VerifyCodeSendEmail : 10,             // 发送 email
  VerifyCodeTmpSession : 11             // 发送临时会话消息，需要携带uid2
}

exports.StausCode = {
  SUCCESS: 200,
  HAS_MORE: 210,

  /** 时间戳已经是最新 **/
  LOCAL_SYNC: 220,

  ADD_FRIEND: 204,

  PROTOCOL_ERROR: 400,
  NO_USER: 401,
  PASSWORD_ERROR: 402,
  LOW_VERSION: 403,
  NEED_VERIFY_CODE: 405,
  VCODE_ERROR: 410,
  VCODE_TIME_OUT: 411,
  CANNT_LOGIN: 404,
  GROUP_ERROR: 481,
  NOT_ACTIVATING: 483,
  NO_USER_NAME: 484,
  USERNAME_ALREADY_USED: 485,
  GROUP_NOTEXIST: 455,

  SERVER_ERROR: 500,
  IM_UNKNOWN: 10000,
  URL_ERROR: 10001,
  DOWNLOAD_ERROR: 10002,
  NET_ERROR_HTTP: 10003,
  ERROR_SDCARD_FULL: 10004,
  FILE_NOT_EXISTS: 10005,
  FILE_READ_ERROR: 10006
};

/**
 * 预置的8对公钥(PEM)格式
 */
exports.IM_RootPubKeyData_PEM = [
['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpYnfGl3hYwCjjgcqV1bgTRVHU',
'i2rE0irjYRCs5TqlqUiuPxUDTNakWAePuVMd+/GFuLWU9U5Zeve0vHEpJ/zaNTWL',
'Qn52a6eiDkZ+W5bwv6AKgpTP4DNBeIGg9gqG/Bfr7uP0mKc0Sm/eq3JmQqPe8XKQ',
'55D8mKoJXXfloh/PqQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDW1gk7A72b5Hdn1HrODaSlORRB',
'y2dJYOfTjmSOEKgdRLJWcpS5t3fAIn+jjKrWPUXDIEmF+4ajWExXWgnYHBrb13xP',
'Iyv9tehjglBAScfvS2XW0XNMsJt8zQwiiMHyE1mXHvj17bRvGDJFAPlttC+p+MQt',
'SVa14Mh/vAKJ4RXkKQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHuWO3qMVDTtbRrLbF7JGT0Q5/',
'bhNEkUZ0ttOAaORshIciXNoFLnHv2xiXTV1UFjXy+MD9a3ztxhk9hgRQ7BB/9qwe',
'hAma8p/Rovr2whVTcbBNVnFyx5BZ/OvW/fvnxhckeBcnDWyb5PtxMn2mJKSt8U5Y',
'vbHfMbta1UwDT0mJOwIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpFvPpt7CcYBFMk68t4akM4IXH',
'cHzIIdZDxwmfYczTeKoF6lQ9vpcApQKaTGMucVg7moE/IoxKfcwD2v0nYHIImqJf',
'//+ExCc1uuvGsV+V8ineuZxtp3o/4kP9xC98FfwQRUyaki/HoHGAZecwMgC+o73H',
'hOzrzczhmnjGrsukLQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3KUecJvpIM1mzQNivuM+0hGdG',
'BAIaJXCSmnh8q42ZEcj9HNDiRttXxhsA7G1zrpPf7PCe25l75wt7FGBvb63tltQQ',
'4yOBmfNxUZiqxe71XT5Fs1BVGLBqK9UcsJodt2ULFOM932t4IsJzeWUL5weJveHo',
'r4zFoExR8i5Da0rmcQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUL9Kcm35vnLyTWCUB9FHH/QIo',
'K5R+pLScx3hXzeRDTM2FWvgs0jFtAF4g6baMQn+hyymo/eLoqPo8CSTw6UOt9hnv',
'wnTFwHQm8AN2Yyh8axRv+QcOTmYxct0NfTnPgIAAzyr5yRQG+rZjSSsEDVlnKHlg',
'lu9cROW7DVdIFptETQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6Ld8xogBWJ5Nf4JHKV87lMzNN',
'7l8sLKb4FcarVj8oX1LR24MqY2pv99m8rcEqjEArGoAMDZCD25B3VqowL/k0T2QA',
'CbgeHiB3aCoQIBgXb4jY8zoYJco8P3SdHwQtZ5nIvoi14+TO5k2FVsn/JxefLqXE',
'6Ct0XLqCcMaTyc33BwIDAQAB',
'-----END PUBLIC KEY-----'].join('\n'),

['-----BEGIN PUBLIC KEY-----',
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3jhqrwbxAtE2tmWJvffBV8Tym',
'TYf5Kw4xWFR+ok+qDsyYEz6P670wvUblLIJqYIuXbUIv9WYl46exZeKrBJMeH1S9',
'1vQyvo4J2ptr8ORra6RAq0I1dNtlJCUbuAFmo1hPdR/2+FfVlOxSNeU/o/kOY5sX',
'gFkk0CkVucaK3kTdZQIDAQAB',
'-----END PUBLIC KEY-----'].join('\n')
];

/**
 * 预置的8对公钥
 */
exports.IM_RootPubKeyData = [
    [
     48, -127, -119, 2, -127, -127, 0, -23, 98, 119, -58, -105, 120, 88, -64, 40,
     -29, -127, -54, -107, -43, -72, 19, 69, 81, -44, -117, 106, -60, -46, 42, -29,
     97, 16, -84, -27, 58, -91, -87, 72, -82, 63, 21, 3, 76, -42,-92, 88, 7, -113,
     -71, 83, 29, -5, -15, -123, -72, -75, -108, -11, 78, 89, 122, -9, -76, -68, 113,
     41, 39, -4, -38, 53, 53, -117, 66, 126, 118, 107, -89, -94, 14, 70, 126, 91,
     -106, -16, -65, -96, 10, -126, -108, -49, -32, 51, 65, 120, -127, -96, -10,
     10, -122, -4, 23, -21, -18, -29, -12, -104, -89, 52, 74, 111, -34, -85, 114,
     102, 66, -93, -34, -15, 114, -112, -25, -112, -4, -104, -86, 9, 93, 119, -27,
     -94, 31, -49, -87, 2, 3, 1, 0, 1
    ],
    [48, -127, -119, 2, -127, -127, 0, -42, -42, 9, 59, 3, -67, -101, -28, 119, 103, -44, 122, -50, 13, -92, -91,
     57, 20, 65, -53, 103, 73, 96, -25, -45, -114, 100, -114, 16, -88, 29, 68, -78, 86, 114, -108, -71, -73, 119,
     -64, 34, 127, -93, -116, -86, -42, 61, 69, -61, 32, 73, -123, -5, -122, -93, 88, 76, 87, 90, 9, -40, 28, 26,
     -37, -41, 124, 79, 35, 43, -3, -75, -24, 99, -126, 80, 64, 73, -57, -17, 75, 101, -42, -47, 115, 76, -80,
     -101, 124, -51, 12, 34, -120, -63, -14, 19, 89, -105, 30, -8, -11, -19, -76, 111, 24, 50, 69, 0, -7, 109,
     -76, 47, -87, -8, -60, 45, 73, 86, -75, -32, -56, 127, -68, 2, -119, -31, 21, -28, 41, 2, 3, 1, 0, 1 ],
    [48, -127, -119, 2, -127, -127, 0, -57, -71, 99, -73, -88, -59, 67, 78, -42, -47, -84, -74, -59, -20, -111,
          -109, -47, 14, 127, 110, 19, 68, -111, 70, 116, -74, -45, -128, 104, -28, 108, -124, -121, 34, 92, -38, 5,
          46, 113, -17, -37, 24, -105, 77, 93, 84, 22, 53, -14, -8, -64, -3, 107, 124, -19, -58, 25, 61, -122, 4, 80,
          -20, 16, 127, -10, -84, 30, -124, 9, -102, -14, -97, -47, -94, -6, -10, -62, 21, 83, 113, -80, 77, 86, 113,
          114, -57, -112, 89, -4, -21, -42, -3, -5, -25, -58, 23, 36, 120, 23, 39, 13, 108, -101, -28, -5, 113, 50,
          125, -90, 36, -92, -83, -15, 78, 88, -67, -79, -33, 49, -69, 90, -43, 76, 3, 79, 73, -119, 59, 2, 3, 1, 0, 1],
    [48, -127, -119, 2, -127, -127, 0, -87, 22, -13, -23, -73, -80, -100, 96, 17, 76, -109, -81, 45, -31, -87, 12,
          -32, -123, -57, 112, 124, -56, 33, -42, 67, -57, 9, -97, 97, -52, -45, 120, -86, 5, -22, 84, 61, -66, -105,
          0, -91, 2, -102, 76, 99, 46, 113, 88, 59, -102, -127, 63, 34, -116, 74, 125, -52, 3, -38, -3, 39, 96, 114, 8,
          -102, -94, 95, -1, -1, -124, -60, 39, 53, -70, -21, -58, -79, 95, -107, -14, 41, -34, -71, -100, 109, -89,
          122, 63, -30, 67, -3, -60, 47, 124, 21, -4, 16, 69, 76, -102, -110, 47, -57, -96, 113, -128, 101, -25, 48,
          50, 0, -66, -93, -67, -57, -124, -20, -21, -51, -52, -31, -102, 120, -58, -82, -53, -92, 45, 2, 3, 1, 0, 1],
    [48, -127, -119, 2, -127, -127, 0, -73, 41, 71, -100, 38, -6, 72, 51, 89, -77, 64, -40, -81, -72, -49, -76,
          -124, 103, 70, 4, 2, 26, 37, 112, -110, -102, 120, 124, -85, -115, -103, 17, -56, -3, 28, -48, -30, 70, -37,
          87, -58, 27, 0, -20, 109, 115, -82, -109, -33, -20, -16, -98, -37, -103, 123, -25, 11, 123, 20, 96, 111, 111,
          -83, -19, -106, -44, 16, -29, 35, -127, -103, -13, 113, 81, -104, -86, -59, -18, -11, 93, 62, 69, -77, 80,
          85, 24, -80, 106, 43, -43, 28, -80, -102, 29, -73, 101, 11, 20, -29, 61, -33, 107, 120, 34, -62, 115, 121,
          101, 11, -25, 7, -119, -67, -31, -24, -81, -116, -59, -96, 76, 81, -14, 46, 67, 107, 74, -26, 113, 2, 3, 1,
          0, 1],
    [48, -127, -119, 2, -127, -127, 0, -44, 47, -46, -100, -101, 126, 111, -100, -68, -109, 88, 37, 1, -12, 81, -57,
          -3, 2, 40, 43, -108, 126, -92, -76, -100, -57, 120, 87, -51, -28, 67, 76, -51, -123, 90, -8, 44, -46, 49,
          109, 0, 94, 32, -23, -74, -116, 66, 127, -95, -53, 41, -88, -3, -30, -24, -88, -6, 60, 9, 36, -16, -23, 67,
          -83, -10, 25, -17, -62, 116, -59, -64, 116, 38, -16, 3, 118, 99, 40, 124, 107, 20, 111, -7, 7, 14, 78, 102,
          49, 114, -35, 13, 125, 57, -49, -128, -128, 0, -49, 42, -7, -55, 20, 6, -6, -74, 99, 73, 43, 4, 13, 89, 103,
          40, 121, 96, -106, -17, 92, 68, -27, -69, 13, 87, 72, 22, -101, 68, 77, 2, 3, 1, 0, 1],
    [48, -127, -119, 2, -127, -127, 0, -70, 45, -33, 49, -94, 0, 86, 39, -109, 95, -32, -111, -54, 87, -50, -27, 51,
          51, 77, -18, 95, 44, 44, -90, -8, 21, -58, -85, 86, 63, 40, 95, 82, -47, -37, -125, 42, 99, 106, 111, -9,
          -39, -68, -83, -63, 42, -116, 64, 43, 26, -128, 12, 13, -112, -125, -37, -112, 119, 86, -86, 48, 47, -7, 52,
          79, 100, 0, 9, -72, 30, 30, 32, 119, 104, 42, 16, 32, 24, 23, 111, -120, -40, -13, 58, 24, 37, -54, 60, 63,
          116, -99, 31, 4, 45, 103, -103, -56, -66, -120, -75, -29, -28, -50, -26, 77, -123, 86, -55, -1, 39, 23, -97,
          46, -91, -60, -24, 43, 116, 92, -70, -126, 112, -58, -109, -55, -51, -9, 7, 2, 3, 1, 0, 1],
    [48, -127, -119, 2, -127, -127, 0, -73, -114, 26, -85, -63, -68, 64, -76, 77, -83, -103, 98, 111, 125, -16, 85,
          -15, 60, -90, 77, -121, -7, 43, 14, 49, 88, 84, 126, -94, 79, -86, 14, -52, -104, 19, 62, -113, -21, -67, 48,
          -67, 70, -27, 44, -126, 106, 96, -117, -105, 109, 66, 47, -11, 102, 37, -29, -89, -79, 101, -30, -85, 4,
          -109, 30, 31, 84, -67, -42, -12, 50, -66, -114, 9, -38, -101, 107, -16, -28, 107, 107, -92, 64, -85, 66, 53,
          116, -37, 101, 36, 37, 27, -72, 1, 102, -93, 88, 79, 117, 31, -10, -8, 87, -43, -108, -20, 82, 53, -27, 63,
          -93, -7, 14, 99, -101, 23, -128, 89, 36, -48, 41, 21, -71, -58, -118, -34, 68, -35, 101, 2, 3, 1, 0, 1]
];





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
