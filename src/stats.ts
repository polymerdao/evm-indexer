import { Context } from "@/generated";
import retry from "async-retry";
import { defaultRetryOpts } from "./retry";

export enum StatName {
  SendPackets = 'SendPackets',
  RecvPackets = 'RecvPackets',
  AckPackets = 'AckPackets',
  WriteAckPacket = 'WriteAckPacket',
  WriteTimeoutPacket = 'WriteTimeoutPacket',
  Timeout = 'Timeout',
  OpenIBCChannel = 'OpenIBCChannel',
  TryIBCChannel = 'TryIBCChannel',
  CloseIBCChannel = 'CloseIBCChannel',
  AckIbcChannel = 'AckIbcChannel',
  ConfirmIbcChannel = 'ConfirmIbcChannel',
}

export async function updateStats(context: Context, id: StatName) {
  await retry(async bail => {
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
    }, defaultRetryOpts
  )
}