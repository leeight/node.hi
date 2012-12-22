///<reference path="Packet.ts" />
///<reference path="PacketHead.ts" />
///<reference path="Protocol.ts" />
///<reference path="S2Data.ts" />
///<reference path="S4Data.ts" />
///<reference path="Message.ts" />
///<reference path="HandshakeBody.ts" />
///<reference path="node/node.d.ts" />

class PacketFactory {
  private static bufferstance: PacketFactory = new PacketFactory();

  static getInstance(): PacketFactory {
    return PacketFactory.bufferstance;
  }

  /**
   * TODO (Buffer's type??)
   */
  create(head: PacketHead, buffer: any): Packet {
    var packet: Packet;

    // LogUtil.d(TAG, "获得的数据总长度" + buffer.limit());
    // /*
    // * 构建PacketHead
    // * （OnePacket）--------------------------------------------------
    // * -------------------------
    // */
    // LogUtil.d(TAG, "构建PacketHead >");
    // byte[] data = new byte[40];
    // buffer.get(data);
    // PacketHead head = PacketHead.createFromBytes(data);
    // LogUtil.d(TAG, head.toString());
    // LogUtil.d(TAG, "PacketHead 原始 后续数据长度" + head.nSrcDataLen);
    // LogUtil.d(TAG, "PacketHead 压缩 后续数据长度" + head.nZipDataLen);
    // LogUtil.d(TAG, "PacketHead 加密 后续数据长度 " + head.nDestDataLen);
    switch (head.ctFlag) {
    /*
     * 构建HandshakeHead
     * （S2）------------------------------------------------------
     * ---------------------
     */
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

      /*
       * 构建HandshakeHead
       * （S4）----------------------------------------------------
       * -----------------------
       */
      case ECtFlagConnectStates.CT_FLAG_CON_S4: {
        // TODO dataview??
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

        // PreferenceUtil.saveTSConfig(new String(xml));
        packet.message = new Message();
        // FIXME Buffer to String
        packet.message.message = xml.toString(); // new String(xml);
        break;
      }

      /*
       * 构建心跳包
       * （KEEPALIVE）--------------------------------------------------------
       * -------------------
       */
      case ECtFlagConnectStates.CT_FLAG_KEEPALIVE: {
        var datakl = new Int8Array(head.nDestDataLen);
        buffer.get(datakl);

        var result = this.needDecrypt(datakl, head.nSrcDataLen);

        packet = new Packet(head, null, null);
        packet.message = new Message();
        // FIXME Buffer to String
        packet.message.message = result.toString(); // new String(result);
        break;
      }

      /*
       * 构建消息包（Message）----------------------------------------------------------
       * -----------------
       */
      case ECtFlagConnectStates.CT_FLAG_CON_OK: {
        var dataOK = new Int8Array(head.nDestDataLen);
        // LogUtil.d(TAG, "流的极限:"+buffer.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        buffer.get(dataOK);

        var decryptReslut = this.needDecrypt(dataOK, head.nZipDataLen);
        if (decryptReslut == null) {
          console.error("Error create type !!!");
          break;
        }

        var decmpressReslut = this.needDecompress(decryptReslut, head.nSrcDataLen);
        if (decmpressReslut == null) {
          console.error("Error create type !!!");
          break;
        }
        // Strbufferg result = new Strbufferg(decmpressReslut);
        // LogUtil.d(TAG, "get Message" + decryptReslut.length + " " + result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decmpressReslut);
        break;
      }

      case ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES: {
        console.log("get message! CT_FLAG_CON_OK_DOZIP_NOAES");
        // LogUtil.d(TAG, "流的极限:"+buffer.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        var dataOK = new Int8Array(head.nDestDataLen);
        buffer.get(dataOK);

        var decmpressReslut = this.needDecompress(dataOK, head.nZipDataLen);
        if (decmpressReslut == null) {
          console.error("Error create type !!!");
          break;
        }
        // Strbufferg result = new Strbufferg(decmpressReslut);
        // LogUtil.d(TAG, "get Message[" + decmpressReslut.length + "] " +
        // result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decmpressReslut);
        break;
      }

      case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES: {
        console.log("get message! CT_FLAG_CON_OK_NOZIP_DOAES");
        // LogUtil.d(TAG, "流的极限:"+buffer.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);

        var dataOK = new Int8Array(head.nDestDataLen);
        buffer.get(dataOK);

        var decryptReslut = this.needDecrypt(dataOK, head.nSrcDataLen);
        if (decryptReslut == null) {
          console.error("Error create type !!!");
          break;
        }
        // Strbufferg result = new Strbufferg(decryptReslut);
        // LogUtil.d(TAG, "get Message" + decryptReslut.length + " " + result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decryptReslut);
        break;
      }

      case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
        console.log("get message! CT_FLAG_CON_OK_NOZIP_NOAES");
        // LogUtil.d(TAG, "流的极限:"+buffer.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        var dataOK = new Int8Array(head.nDestDataLen);
        buffer.get(dataOK);
        // Strbufferg result = new Strbufferg(dataOK);
        // LogUtil.d(TAG, "get Message[" + dataOK.length + "] " + result);
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

  }

  /**
   * 解压缩
   * 
   * @param data
   * @param length
   * @return
   */
  private needDecompress(data: Int8Array, length: number): Int8Array {
    return new Int8Array(0);
    /*
    var uzipResult: Int8Array = Utils.decompressData(data, length);
    if (uzipResult == null || uzipResult.length != length) {
      LogUtil.e(TAG, "uzipResult Error");
      return null;
    }
    return uzipResult;
    */
  }

  /**
   * 解密
   * 
   * @param data
   * @param length
   * @return
   */
  private needDecrypt(data: Int8Array, length: number): Int8Array {
    return new Int8Array(0);
    /*
    byte[] aesRusult = null;
    try {
      aesRusult = AES.decrypt(Handshake.AES_KEY, data);
    } catch (Exception e) {
      LogUtil.e(TAG, "", e);
    }
    if (aesRusult == null) {
      LogUtil.d(TAG, "AES coder faile");
      return aesRusult;
    }

    if (aesRusult.length != length) {
      byte[] temp = new byte[aesRusult.length - length];
      System.arraycopy(aesRusult, length, temp, 0, aesRusult.length - length);
      boolean flag = false;
      for (buffert i = 0; i < temp.length; i++) {
        if (temp[i] != 0) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        byte[] tempReslut = new byte[length];
        System.arraycopy(aesRusult, 0, tempReslut, 0, length);
        return tempReslut;
      } else {
        LogUtil.e(TAG, "aesRusult Error");
        return null;
      }
    }

    return aesRusult;
    */
  }
}
