var PacketFactory = (function () {
    function PacketFactory() { }
    PacketFactory.bufferstance = new PacketFactory();
    PacketFactory.getInstance = function getInstance() {
        return PacketFactory.bufferstance;
    }
    PacketFactory.prototype.create = function (head, buffer) {
        var packet;
        switch(head.ctFlag) {
            case ECtFlagConnectStates.CT_FLAG_CON_S2: {
                var data2 = new Int8Array(18);
                buffer.get(data2);
                var s2Data = S2Data.createFromBytes(data2);
                var data3 = new Int8Array(s2Data.nDataLen);
                buffer.get(data3);
                var hb = new HandshakeBody();
                hb.keyData = data3;
                packet = new Packet(head, s2Data, hb);
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_CON_S4: {
                var data4 = new Int8Array(32);
                buffer.get(data4);
                var s4Data = S4Data.createFromBytes(data4);
                var datas4 = new Int8Array(s4Data.nDataLen);
                buffer.get(datas4);
                var hbs4 = new HandshakeBody();
                hbs4.keyData = datas4;
                packet = new Packet(head, s4Data, hbs4);
                var xmlLength = head.nSrcDataLen - 32 - s4Data.nDataLen;
                var xml = new Int8Array(xmlLength);
                buffer.get(xml);
                packet.message = new Message();
                packet.message.message = xml.toString();
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_KEEPALIVE: {
                var datakl = new Int8Array(head.nDestDataLen);
                buffer.get(datakl);
                var result = this.needDecrypt(datakl, head.nSrcDataLen);
                packet = new Packet(head, null, null);
                packet.message = new Message();
                packet.message.message = result.toString();
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_CON_OK: {
                var dataOK = new Int8Array(head.nDestDataLen);
                buffer.get(dataOK);
                var decryptReslut = this.needDecrypt(dataOK, head.nZipDataLen);
                if(decryptReslut == null) {
                    console.error("Error create type !!!");
                    break;
                }
                var decmpressReslut = this.needDecompress(decryptReslut, head.nSrcDataLen);
                if(decmpressReslut == null) {
                    console.error("Error create type !!!");
                    break;
                }
                packet = new Packet();
                packet.packetHead = head;
                packet.message = new Message(decmpressReslut);
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES: {
                console.log("get message! CT_FLAG_CON_OK_DOZIP_NOAES");
                var dataOK = new Int8Array(head.nDestDataLen);
                buffer.get(dataOK);
                var decmpressReslut = this.needDecompress(dataOK, head.nZipDataLen);
                if(decmpressReslut == null) {
                    console.error("Error create type !!!");
                    break;
                }
                packet = new Packet();
                packet.packetHead = head;
                packet.message = new Message(decmpressReslut);
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES: {
                console.log("get message! CT_FLAG_CON_OK_NOZIP_DOAES");
                var dataOK = new Int8Array(head.nDestDataLen);
                buffer.get(dataOK);
                var decryptReslut = this.needDecrypt(dataOK, head.nSrcDataLen);
                if(decryptReslut == null) {
                    console.error("Error create type !!!");
                    break;
                }
                packet = new Packet();
                packet.packetHead = head;
                packet.message = new Message(decryptReslut);
                break;
            }

            case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
                console.log("get message! CT_FLAG_CON_OK_NOZIP_NOAES");
                var dataOK = new Int8Array(head.nDestDataLen);
                buffer.get(dataOK);
                packet = new Packet();
                packet.packetHead = head;
                packet.message = new Message(dataOK);
                break;
            }

            default: {
                console.error("Error create type !!!");
                break;
            }

        }
        return packet;
    };
    PacketFactory.prototype.needDecompress = function (data, length) {
        return new Int8Array(0);
    };
    PacketFactory.prototype.needDecrypt = function (data, length) {
        return new Int8Array(0);
    };
    return PacketFactory;
})();
