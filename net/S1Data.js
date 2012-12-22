var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var S1Data = (function (_super) {
    __extends(S1Data, _super);
    function S1Data() {
        _super.apply(this, arguments);

        this.nEPVer = 1;
        this.nConMethod = ProtocolConstant.CON_METHOD_A;
    }
    S1Data.prototype.getBytes = function () {
        return new Int8Array(0);
    };
    return S1Data;
})(HandshakeHead);
