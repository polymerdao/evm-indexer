import { DatabaseModel } from "@ponder/core/src/types/model";
import { Infer } from "@ponder/core/src/schema/types";
import { schema } from "@/generated";

export enum StatName {
  SendPackets = 'SendPackets',
  RecvPackets = 'RecvPackets',
  AckPackets = 'AckPackets',
  WriteAckPacket = 'WriteAckPacket',
}

export async function updateStats<T extends DatabaseModel<Infer<schema>["Stats"]>>(Stats: T, id: StatName) {
  await Stats.upsert({
    id: id,
    create: {
      val: 1,
    },
    update: ({current}: T) => {
      return {
        val: current.val + 1
      }
    }
  });

}