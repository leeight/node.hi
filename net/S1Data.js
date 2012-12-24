(function (net) {
    var S1Data = (function (_super) {
        __extends(S1Data, _super);
        function S1Data() {
            _super.apply(this, arguments);

            this.nEPVer = 1;
            this.nConMethod = ProtocolConstant.CON_METHOD_A;
        }
        S1Data.prototype.getBytes = function () {
            return new Buffer([]);
        };
        return S1Data;
    })(net.HandshakeHead);
    net.S1Data = S1Data;    
})(exports.net || (exports.net = {}));
var net = exports.net;
