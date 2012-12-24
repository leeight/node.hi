var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var constant = require("./constant")
var Utils = require("./Utils")
var ECtFlagConnectStates = constant.constant.ECtFlagConnectStates;
var ProtocolConstant = constant.constant.ProtocolConstant;
var ECtSendFlags = constant.constant.ECtSendFlags;
(function (protocol) {
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
    protocol.HandshakeHead = HandshakeHead;    
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
    protocol.HandshakeBody = HandshakeBody;    
    var S1Data = (function (_super) {
        __extends(S1Data, _super);
        function S1Data() {
            _super.apply(this, arguments);

            this.nEPVer = 1;
            this.nConMethod = ProtocolConstant.CON_METHOD_A;
        }
        S1Data.prototype.getBytes = function () {
            var bytes = new Buffer(17);
            bytes.fill(0);
            bytes.writeInt8(this.nEPVer, 0);
            bytes.writeInt8(this.nConMethod[0], 1);
            bytes.writeInt8(this.nConMethod[1], 2);
            bytes.writeInt8(this.nConMethod[2], 3);
            bytes.writeInt8(this.nConMethod[3], 4);
            bytes.writeInt32LE(this.nReserved1, 4);
            bytes.writeInt32LE(this.nReserved2, 8);
            bytes.writeInt32LE(this.nDataLen, 12);
            return bytes;
        };
        return S1Data;
    })(HandshakeHead);
    protocol.S1Data = S1Data;    
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
    protocol.PacketHead = PacketHead;    
    var Message = (function () {
        function Message(data) {
            this.data = data;
        }
        Message.prototype.getBytes = function () {
            if(this.message == null) {
                return this.data;
            }
            return new Buffer(this.message);
        };
        return Message;
    })();
    protocol.Message = Message;    
    var Packet = (function () {
        function Packet(packetHead, handshakeHead, handshakeBody) {
            this.packetHead = packetHead;
            this.handshakeHead = handshakeHead;
            this.handshakeBody = handshakeBody;
        }
        Packet.keepAlive = new Packet(PacketHead.HEARTBEAT, null, null);
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
    protocol.Packet = Packet;    
})(exports.protocol || (exports.protocol = {}));
var protocol = exports.protocol;
