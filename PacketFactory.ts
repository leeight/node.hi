///<reference path="Packet.ts" />
///<reference path="Protocol.ts" />
///<reference path="S2Data.ts" />
///<reference path="S4Data.ts" />

class PacketFactory {
  private static instance: PacketFactory = new PacketFactory();

  static getInstance(): PacketFactory {
    return PacketFactory.instance;
  }

  create(head: PacketHead, in: IoBuffer): Packet {
    var packet: Packet = null;

    // LogUtil.d(TAG, "获得的数据总长度" + in.limit());
    // /*
    // * 构建PacketHead
    // * （OnePacket）--------------------------------------------------
    // * -------------------------
    // */
    // LogUtil.d(TAG, "构建PacketHead >");
    // byte[] data = new byte[40];
    // in.get(data);
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
        var data2: Int8Array = new Int8Array(18);
        in.get(data2);
        
        S2Data s2Data = S2Data.createFromBytes(data2);
        LogUtil.d(TAG, s2Data.toString());

        byte[] data3 = new byte[s2Data.nDataLen];
        in.get(data3);
        HandshakeBody hb = new HandshakeBody();
        hb.keyData = data3;
        LogUtil.d(TAG, "key:" + hb.toString());
        packet = new Packet(head, s2Data, hb);
      }
        break;
      /*
       * 构建HandshakeHead
       * （S4）----------------------------------------------------
       * -----------------------
       */
      case ECtFlagConnectStates.CT_FLAG_CON_S4: {

        byte[] data4 = new byte[32];
        in.get(data4);
        LogUtil.d(TAG, "data4" + Arrays.toString(data4));
        S4Data s4Data = S4Data.createFromBytes(data4);
        LogUtil.d(TAG, s4Data.toString());
        //
        byte[] datas4 = new byte[s4Data.nDataLen];
        in.get(datas4);
        HandshakeBody hbs4 = new HandshakeBody();
        hbs4.keyData = datas4;
        LogUtil.d(TAG, "key:" + hbs4.toString());
        packet = new Packet(head, s4Data, hbs4);
        int xmlLength = head.nSrcDataLen - 32 - s4Data.nDataLen;
        byte[] xml = new byte[xmlLength];
        in.get(xml);
        PreferenceUtil.saveTSConfig(new String(xml));
        packet.message = new Message();
        packet.message.message = new String(xml);
        break;
      }
      /*
       * 构建心跳包
       * （KEEPALIVE）--------------------------------------------------------
       * -------------------
       */
      case ECtFlagConnectStates.CT_FLAG_KEEPALIVE:
        LogUtil.d(TAG, "get keep a live!");

        byte[] datakl = new byte[head.nDestDataLen];
        in.get(datakl);
        byte[] reslut = needDecrypt(datakl, head.nSrcDataLen);

        packet = new Packet(head, null, null);
        packet.message = new Message();
        packet.message.message = new String(reslut);
        break;
      /*
       * 构建消息包（Message）----------------------------------------------------------
       * -----------------
       */
      case ECtFlagConnectStates.CT_FLAG_CON_OK: {

        LogUtil.d(TAG, "get message! CT_FLAG_CON_OK");
        byte[] dataOK = new byte[head.nDestDataLen];
        // LogUtil.d(TAG, "流的极限:"+in.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        in.get(dataOK);

        byte[] decryptReslut = needDecrypt(dataOK, head.nZipDataLen);
        if (decryptReslut == null) {
          LogUtil.e(TAG, "Error create type !!!");
          break;
        }

        byte[] decmpressReslut = needDecompress(decryptReslut, head.nSrcDataLen);
        if (decmpressReslut == null) {
          LogUtil.e(TAG, "Error create type !!!");
          break;
        }
        // String result = new String(decmpressReslut);
        // LogUtil.d(TAG, "get Message" + decryptReslut.length + " " + result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decmpressReslut);

        break;
      }
      case ECtFlagConnectStates.CT_FLAG_CON_OK_DOZIP_NOAES: {
        LogUtil.d(TAG, "get message! CT_FLAG_CON_OK_DOZIP_NOAES");
        // LogUtil.d(TAG, "流的极限:"+in.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        byte[] dataOK = new byte[head.nDestDataLen];
        in.get(dataOK);

        byte[] decmpressReslut = needDecompress(dataOK, head.nZipDataLen);
        if (decmpressReslut == null) {
          LogUtil.e(TAG, "Error create type !!!");
          break;
        }
        // String result = new String(decmpressReslut);
        // LogUtil.d(TAG, "get Message[" + decmpressReslut.length + "] " +
        // result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decmpressReslut);
        break;
      }
      case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_DOAES: {

        LogUtil.d(TAG, "get message! CT_FLAG_CON_OK_NOZIP_DOAES");
        // LogUtil.d(TAG, "流的极限:"+in.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);

        byte[] dataOK = new byte[head.nDestDataLen];
        in.get(dataOK);

        byte[] decryptReslut = needDecrypt(dataOK, head.nSrcDataLen);
        if (decryptReslut == null) {
          LogUtil.e(TAG, "Error create type !!!");
          break;
        }
        // String result = new String(decryptReslut);
        // LogUtil.d(TAG, "get Message" + decryptReslut.length + " " + result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(decryptReslut);

        break;
      }
      case ECtFlagConnectStates.CT_FLAG_CON_OK_NOZIP_NOAES: {
        LogUtil.d(TAG, "get message! CT_FLAG_CON_OK_NOZIP_NOAES");
        // LogUtil.d(TAG, "流的极限:"+in.limit());
        // LogUtil.d(TAG, "消息的长度:"+head.nDestDataLen);
        byte[] dataOK = new byte[head.nDestDataLen];
        in.get(dataOK);
        // String result = new String(dataOK);
        // LogUtil.d(TAG, "get Message[" + dataOK.length + "] " + result);
        packet = new Packet();
        packet.packetHead = head;
        packet.message = new Message(dataOK);
        break;
      }

      default:
        LogUtil.e(TAG, "Error create type !!!");
        break;
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
    return new Int8Array([]);
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
    return new Int8Array([]);
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
      for (int i = 0; i < temp.length; i++) {
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
