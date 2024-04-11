import { Context } from "@/generated";

export enum StatName {
  SendPackets = 'SendPackets',
  RecvPackets = 'RecvPackets',
  AckPackets = 'AckPackets',
  WriteAckPacket = 'WriteAckPacket',
  WriteTimeoutPacket = 'WriteTimeoutPacket',
  Timeout = 'Timeout',
  OpenIBCChannel = 'OpenIBCChannel',
  CloseIBCChannel = 'CloseIBCChannel',
  ConnectIbcChannel = 'ConnectIbcChannel',
}

export async function updateStats(context: Context, id: StatName) {
  await context.db.Stat.upsert({
    id: id,
    create: {
      val: 1,
    },
    update: ({current}) => {
      return {
        val: current.val + 1
      }
    }
  });
}