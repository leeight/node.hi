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
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var S4Data = (function (_super) {
    __extends(S4Data, _super);
    function S4Data() {
        _super.apply(this, arguments);

        this.seed = new Int8Array(16);
    }
    S4Data.prototype.getBytes = function () {
        return new Int8Array(0);
    };
    S4Data.createFromBytes = function createFromBytes(data) {
        return new S4Data();
    }
    return S4Data;
})(HandshakeHead);
