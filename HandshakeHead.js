var HandshakeHead = (function () {
    function HandshakeHead() {
        this.nReserved1 = 0;
        this.nReserved2 = 0;
        this.nDataLen = 0;
    }
    HandshakeHead.prototype.getBytes = function () {
        return null;
    };
    return HandshakeHead;
})();
exports.HandshakeHead = HandshakeHead;

