var net;
(function (net) {
    var PacketHead = (function () {
        function PacketHead(ctFlag, nSrcDataLen, nZipDataLen, nDestDataLen) {
            this.nVer = new Buffer([
                0, 
                0, 
                1, 
                0
            ]);
            this.nTag = ProtocolConstant.CT_TAG;
            this.bEncrypt = 1;
            this.bCompress = 1;
            this.bHeartBeat = 1;
            this.nReserved26 = 26;
            this.nSendFlag = ECtSendFlags.CT_SEND_FLAG_LOGIN;
            this.nCategory = 0;
            this.nReserved1 = 0;
            this.nReserved2 = 0;
            this.ctFlag = ctFlag;
            this.nSrcDataLen = nSrcDataLen;
            this.nZipDataLen = nZipDataLen;
            this.nDestDataLen = nDestDataLen;
        }
        PacketHead.S1 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S1, 0, 0, 0);
        PacketHead.S2 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S2, 0, 0, 0);
        PacketHead.S3 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S3, 0, 0, 0);
        PacketHead.S4 = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_S4, 0, 0, 0);
        PacketHead.MESSAGE = new PacketHead(ECtFlagConnectStates.CT_FLAG_CON_OK, 0, 0, 0);
        PacketHead.HEARTBEAT = new PacketHead(ECtFlagConnectStates.CT_FLAG_KEEPALIVE, 0, 0, 0);
        PacketHead.prototype.getBytes = function () {
            return new Buffer([]);
        };
        PacketHead.prototype.createFromBytes = function () {
            return new PacketHead(0, 0, 0, 0);
        };
        return PacketHead;
    })();
    net.PacketHead = PacketHead;    
})(net || (net = {}));
