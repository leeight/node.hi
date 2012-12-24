var User = (function () {
    function User(account, password) {
        this.imversion = "1,0,0,0";
        this.priority = 20;
        this.client_type = 4;
        this.platform = "android";
        this.redirectTimes = "0";
        this.userStatus = 1;
        this.lastLoginTime = 0;
        this.account = account;
        this.password = password;
    }
    User.LOGIN = 1;
    User.LOGOUT = 2;
    User.QUIT = 0;
    User.prototype.getAge = function () {
        if(this.birthday != null && this.birthday.trim().length != 0) {
            var nowYear = new Date().getFullYear();
            var temp = this.birthday.split("-");
            if(temp.length != 0) {
                var byear = parseInt(temp[0], 10);
                if(byear == 0) {
                    return null;
                }
                return "" + (1900 + nowYear - byear);
            }
        }
        return null;
    };
    User.prototype.getSex = function () {
        var ret;
        switch(this.sex) {
            case Constant.SEX_TYPE_MAN: {
                ret = "男";
                break;

            }
            case Constant.SEX_TYPE_WOMAN: {
                ret = "女";
                break;

            }
            default: {
                ret = "";
                break;

            }
        }
        return ret;
    };
    User.prototype.getDisplayName = function () {
        if(this.nickname != null && this.nickname.length != 0) {
            return this.account;
        } else {
            return this.nickname;
        }
    };
    return User;
})();
