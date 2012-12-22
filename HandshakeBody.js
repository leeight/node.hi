var HandshakeBody = (function () {
    function HandshakeBody() { }
    HandshakeBody.prototype.getLength = function () {
        if(this.keyData != null) {
            return this.keyData.length;
        } else {
            return 0;
        }
    };
    return HandshakeBody;
})();
