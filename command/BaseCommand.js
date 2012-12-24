var BaseCommand = (function () {
    function BaseCommand(superCommand, command, version) {
        this.contentType = BaseCommand.CONTENT_TYPE_TEXT;
        this.commandHead = {
        };
        this.superCommand = superCommand;
        this.command = command;
        this.version = version;
        this.protocolType = ProtocolType.valueOf(superCommand, command);
    }
    BaseCommand.SPACE = ' ';
    BaseCommand.CHANGE_LINE = '\n';
    BaseCommand.SEPARATED = "\r\n";
    BaseCommand.SEMICOLON = ":";
    BaseCommand.MESTHOD_KEY = "method:";
    BaseCommand.CONTENT_LENGTH_KEY = "content-length";
    BaseCommand.CONTENT_TYPE_KEY = "content-type";
    BaseCommand.REQUEST = 'R';
    BaseCommand.CONTENT_TYPE_TEXT = "text";
    BaseCommand.prototype.addCommandHead = function (key, value) {
        this.commandHead[key] = value;
    };
    BaseCommand.prototype.isNotEmpty = function (msg) {
        return msg != null && msg.trim().length != 0;
    };
    BaseCommand.prototype.createCommand = function () {
        this.commandBody = this.createCommandBody();
        var sb = [];
        this.seq = NetManager.getNextId();
        sb.push(this.superCommand);
        sb.push(BaseCommand.SPACE);
        sb.push(this.version);
        sb.push(BaseCommand.SPACE);
        sb.push(BaseCommand.REQUEST);
        sb.push(BaseCommand.SPACE);
        sb.push(this.seq);
        sb.push(BaseCommand.CHANGE_LINE);
        if(this.isNotEmpty(this.command)) {
            sb.push(BaseCommand.MESTHOD_KEY);
            sb.push(this.command);
            sb.push(BaseCommand.CHANGE_LINE);
        }
        if(this.isNotEmpty(this.commandBody)) {
            sb.push(BaseCommand.CONTENT_LENGTH_KEY);
            sb.push(BaseCommand.SEMICOLON);
            sb.push(Buffer.byteLength(this.commandBody, 'utf8'));
            sb.push(BaseCommand.CHANGE_LINE);
            sb.push(BaseCommand.CONTENT_TYPE_KEY);
            sb.push(BaseCommand.SEMICOLON);
            sb.push(this.contentType);
            sb.push(BaseCommand.CHANGE_LINE);
        }
        var keys = Object.keys(this.commandHead);
        for(var i = 0; i < keys.length; i++) {
            sb.push(keys[i]);
            sb.push(BaseCommand.SEMICOLON);
            sb.push(this.commandHead[keys[i]]);
            sb.push(BaseCommand.CHANGE_LINE);
        }
        sb.push(BaseCommand.SEPARATED);
        if(this.isNotEmpty(this.commandBody)) {
            sb.push(this.commandBody);
        }
        return sb.join('');
    };
    BaseCommand.prototype.createCommandBody = function () {
        return '';
    };
    return BaseCommand;
})();
