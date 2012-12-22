var Message = (function () {
    function Message(data) {
        this.data = data;
    }
    Message.prototype.getBytes = function () {
        if(this.message == null) {
            return this.data;
        }
        return [];
    };
    return Message;
})();
exports.Message = Message;

