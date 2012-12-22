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
var S3Data = (function (_super) {
    __extends(S3Data, _super);
    function S3Data() {
        _super.apply(this, arguments);

    }
    S3Data.prototype.getBytes = function () {
        return new Int8Array(0);
    };
    S3Data.createFromBytes = function createFromBytes(data) {
        return new S3Data();
    }
    return S3Data;
})(HandshakeHead);
