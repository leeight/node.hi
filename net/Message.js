var Message = (function () {
    function Message(data) {
        this.data = data;
    }
    Message.prototype.getBytes = function () {
        if(this.message == null) {
            return this.data;
        }
        return new Buffer(this.message);
    };
    return Message;
})();
