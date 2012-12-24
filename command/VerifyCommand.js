var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var VerifyCommand = (function (_super) {
    __extends(VerifyCommand, _super);
    function VerifyCommand(type, uid, lid, friendUid, uid2) {
        _super.call(this, "security", "verify", "1.0");
        this.uid = uid;
        this.lid = lid;
        this.friend = friendUid;
        this.uid2 = uid2;
        this.type = type;
        this.addCommandHead("uid2", String(uid2));
        this.setCommandHead();
    }
    VerifyCommand.prototype.setCommandHead = function () {
        this.addCommandHead("uid", String(this.uid));
        this.addCommandHead("lid", this.lid);
        switch(this.type) {
            case VerifyCodeType.VerifyCodeLogin: {
                break;

            }
            case VerifyCodeType.VerifyCodeAddFriend: {
                this.addCommandHead("friend", String(this.friend));
                break;

            }
            default: {
                break;

            }
        }
        this.addCommandHead("type", String(this.type.getValue()));
    };
    return VerifyCommand;
})(BaseCommand);
