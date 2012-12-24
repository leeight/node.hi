var net;
(function (net) {
    var Packet = (function () {
        function Packet(packetHead, handshakeHead, handshakeBody) {
            this.packetHead = packetHead;
            this.handshakeHead = handshakeHead;
            this.handshakeBody = handshakeBody;
        }
        Packet.keepAlive = new Packet(net.PacketHead.HEARTBEAT, null, null);
        Packet.prototype.getBytes = function () {
            var result = null;
            var ctFlag = this.packetHead.ctFlag;
            switch(ctFlag) {
                case ECtFlagConnectStates.CT_FLAG_CON_S1: {
                    result = Utils.sumArray(this.packetHead.getBytes(), this.handshakeHead.getBytes());
                    break;

                }
                case ECtFlagConnectStates.CT_FLAG_CON_S2: {
                    break;

                }
                case ECtFlagConnectStates.CT_FLAG_CON_S3: {
                    result = Utils.sumArray(this.packetHead.getBytes(), this.handshakeHead.getBytes());
                    if(this.handshakeBody == null) {
                        return null;
                    }
                    result = Utils.sumArray(result, this.handshakeBody.keyData);
                    break;

                }
                case ECtFlagConnectStates.CT_FLAG_CON_S4: {
                    break;

                }
                case ECtFlagConnectStates.CT_FLAG_CON_OK: {
                    result = Utils.sumArray(this.packetHead.getBytes(), this.message.getBytes());
                    break;

                }
                case ECtFlagConnectStates.CT_FLAG_KEEPALIVE: {
                    result = this.packetHead.getBytes();
                    break;

                }
                default: {
                    break;

                }
            }
            return result;
        };
        return Packet;
    })();
    net.Packet = Packet;    
})(net || (net = {}));
