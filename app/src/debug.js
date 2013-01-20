/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/debug.js ~ 2013/01/18 15:48:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 调试接口
 **/
define(function(){
  return {
    isLocal: function() {
      return document.location.protocol === 'http:';
    },
    isEnable: function() {
      return !!document.location.search.match(/debug=1/);
    },
    getDefaultUser: function() {
      return {
        'imid': 8964,
        'avatar': '0.jpg',
        'account': 'linuxracer(debug)',
        'personal_comment': 'hello world(debug)'
      };
    },
    getDefaultFriendList: function() {
      var friends = [
        {'avatar': '2.jpg', 'client_type': 0, 'psp_status': '', 'status': 5, 'personal_comment': '', 'birthday': '1980-2-24', 'sex': 2, 'email': 'yaoasm1@126.com', 'music': '', 'nickname':'', 'personal_desc': '', 'imid': 32353201, 'monicker': '', 'baiduid': 'yaoasm', 'has_camera': ''},
        {'avatar': '1e82e5a0e0bd1081cf2b5a99e9b1cd93.png', 'client_type': 1, 'psp_status': '', 'status': 1, 'personal_comment': '', 'birthday': '0-0-0', 'sex': 2, 'email': 'wangm1800@163.com', 'nickname': '王敏', 'imid': 346518627, 'baiduid': 'wangminsy001', 'has_camera': ''}
      ];
      return friends;
    },
    getIncomingMesage: function(opt_imid) {
      var message = {
        "source_type": "incoming",
        "content": "hello world " + Math.random(),
        "from_id": (opt_imid || "346518627"),
        "time": Date.now()
      }

      return message;
    },
    log: function(msg) {
      $("#debug-msg").append("[" + new Date().toJSON() + "]:" + msg + "<br>");
    }
  }
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
