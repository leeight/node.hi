var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var LoginCommand = (function (_super) {
    __extends(LoginCommand, _super);
    function LoginCommand(url, time, period, code, user) {
        _super.call(this, "login", "login", "4.2");
        this.v_url = url;
        this.v_time = time;
        this.v_period = period;
        this.v_code = code;
        this.user = user;
        this.setCommandHead();
    }
    LoginCommand.prototype.setCommandHead = function () {
        this.addCommandHead("v_url", this.v_url);
        this.addCommandHead("v_time", this.v_time);
        this.addCommandHead("v_period", this.v_period);
        this.addCommandHead("v_code", this.v_code);
        this.addCommandHead("priority", this.user.priority + "");
    };
    LoginCommand.prototype.createCommandBody = function () {
        var user = this.user;
        var xml = [];
        xml.push('<?xml version="1.0" encoding="UTF-8" ?>');
        xml.push('<login>');
        xml.push('<user');
        if(user.account) {
            xml.push(' account="' + user.account + '"');
        }
        if(user.password) {
            xml.push(' password="' + this.md5Password(user.password) + '"');
        }
        xml.push(' imversion="' + user.imversion + '"');
        xml.push(' redirect_times="' + user.redirectTimes + '"');
        xml.push(' priority="' + user.priority + '"');
        xml.push(' platform="' + user.platform + '"');
        xml.push(' client_type="' + user.client_type + '"');
        if(user.newUsername) {
            xml.push(' new_username="' + user.newUsername + '"');
        }
        xml.push('></user>');
        xml.push('</login>');
        return xml.join('');
    };
    LoginCommand.prototype.md5Password = function (password) {
        if(Handshake.MD5_SEED == null) {
            return "";
        }
        var first = this.Md5(new Buffer(password));
        var temp = Utils.sumArray(first, Handshake.MD5_SEED);
        var result = this.Md5(temp);
        return result.toString();
    };
    LoginCommand.prototype.Md5 = function (data) {
        return new Buffer('hello');
    };
    return LoginCommand;
})(BaseCommand);
