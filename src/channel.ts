import { Virtual } from "@ponder/core";
import { config, schema } from "@/generated";
import { Prettify } from "viem/types/utils";
import { Infer } from "@ponder/core/src/schema/types";

async function updateInitToTryTime<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, channel: Prettify<Infer<schema>["Channel"]>) {
  if (channel.state == "INIT" && !channel.initToTryTime) {
    const openInitChannel = await context.db.OpenIbcChannel.findUnique({id: channel.openInitChannelId});
    if (!openInitChannel) {
      throw new Error(`No openInitChannel found for channel with state INIT and id: ${channel.id}`);
    }

    const openTryChannel = await context.db.OpenIbcChannel.findMany({
      where: {
        portId: openInitChannel.counterpartyPortId,
        blockTimestamp: {gt: openInitChannel.blockTimestamp}
      },
      orderBy: {blockTimestamp: "asc"},
      limit: 1
    });

    if (openTryChannel.items.length > 1) {
      throw new Error(`Multiple openTryChannels found for openInitChannelId: ${channel.openInitChannelId}`);
    }

    if (openTryChannel.items.length == 1) {
      let initToTryTime = openTryChannel.items[0]!.blockTimestamp - openInitChannel.blockTimestamp;
      await context.db.Channel.update({
        id: channel.id,
        data: {
          initToTryTime: Number(initToTryTime),
          openTryChannelId: openTryChannel.items[0]!.id,
        },
      });
      const cpChannel = await context.db.Channel.findMany({
        where: {
          openTryChannelId: openTryChannel.items[0]!.id,
          state: "TRY"
        }
      });

      if (cpChannel.items.length == 0) {
        throw new Error(`No counterparty channel found for openTryChannelId: ${openTryChannel.items[0]!.id}`);
      }

      if (cpChannel.items.length > 1) {
        throw new Error(`Multiple counterparty channels found for openTryChannelId: ${openTryChannel.items[0]!.id}`);
      }

      await context.db.Channel.update({
        id: cpChannel.items[0]!.id,
        data: {
          initToTryTime: Number(initToTryTime),
          openInitChannelId: channel.id,
        },
      });
    }
  }

  if (channel.state == "TRY" && !channel.initToTryTime) {
    const openTryChannel = await context.db.OpenIbcChannel.findUnique({id: channel.openTryChannelId});
    const openInitChannel = await context.db.OpenIbcChannel.findMany({
      where: {
        portId: openTryChannel?.counterpartyPortId,
        blockTimestamp: {lt: openTryChannel!.blockTimestamp}
      },
      orderBy: {blockTimestamp: "desc"},
      limit: 1
    });

    if (openInitChannel.items.length > 1) {
      throw new Error(`Multiple openInitChannels found for openTryChannelId: ${channel.openTryChannelId}`);
    }

    if (openInitChannel.items.length == 1) {
      let initToTryTime = openTryChannel!.blockTimestamp - openInitChannel.items[0]!.blockTimestamp;
      await context.db.Channel.update({
        id: channel.id,
        data: {
          initToTryTime: Number(initToTryTime),
          openInitChannelId: openInitChannel.items[0]!.id
        },
      });
      const cpChannel = await context.db.Channel.findMany({
        where: {
          openInitChannelId: openInitChannel.items[0]!.id,
          state: "INIT"
        }
      });

      if (cpChannel.items.length == 0) {
        throw new Error(`No counterparty channel found for openInitChannelId: ${openInitChannel.items[0]!.id}`);
      }

      if (cpChannel.items.length > 1) {
        throw new Error(`Multiple counterparty channels found for openInitChannelId: ${openInitChannel.items[0]!.id}`);
      }

      await context.db.Channel.update({
        id: cpChannel.items[0]!.id,
        data: {
          initToTryTime: Number(initToTryTime),
          openTryChannelId: channel.id
        },
      });
    }
  }

}

export async function updateChannel<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, id: string) {
  let channel = await context.db.Channel.findUnique({id})
  if (!channel) {
    console.warn('No channel found with id', id)
    return;
  }

  await updateInitToTryTime(context, channel)
}