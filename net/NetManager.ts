///<reference path="Packet.ts" />
///<reference path="PacketHead.ts" />
///<reference path="Message.ts" />
///<reference path="../command/BaseCommand.ts" />
///<reference path="../node/node.d.ts" />

class NetManager {
  private static messageId = 1;
  static getNextId(): number {
    return messageId++;
  }

  sendMessage(command: BaseCommand): number {
    return this.doSend(command);
  }

  private doSend(command: BaseCommand): number {
    var packet = new Packet();
    packet.packetHead = PacketHead.MESSAGE;
    
    var t = command.createCommand();
    packet.message = new Message(new Buffer(t));
    
    // tunnel.send(packet);
    // cacheCommand(command);
    // console.log("send --" + isHandshakeOK + "-->\n: " + t + ":size" + sendedCommand.size());

    return command.seq;
  }
}