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
var S2Data = (function (_super) {
    __extends(S2Data, _super);
    function S2Data() {
        _super.apply(this, arguments);

    }
    S2Data.prototype.getBytes = function () {
        return new Int8Array(0);
    };
    S2Data.createFromBytes = function createFromBytes(data) {
        return new S2Data();
    }
    return S2Data;
})(HandshakeHead);
