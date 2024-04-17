import { Virtual } from "@ponder/core";
import { config, type Context, schema, type Schema } from "@/generated";
import logger from "./logger";
import { TmClient } from "./client";
import { IndexedTx, StargateClient } from "@cosmjs/stargate";

async function updateInitToTryMetrics<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, channel: Schema['Channel']) {
  const stargateClient = await TmClient.getStargate();

  if (channel.openInitChannelId && channel.openTryChannelId && !channel.initToTryTime) {
    const openInitChannel = await context.db.OpenIbcChannel.findUnique({id: channel.openInitChannelId!});
    const openTryChannel = await context.db.TryIbcChannel.findUnique({id: channel.openTryChannelId!});
    if (!openInitChannel) {
      logger.error(`No openInitChannel found for channel id: ${channel.id}`);
      return;
    }
    if (!openTryChannel) {
      logger.error(`No openTryChannel found for channel id: ${channel.id}`);
      return;
    }

    let initToTryTime = openTryChannel!.blockTimestamp - openInitChannel.blockTimestamp;
    const initTx = await getChannelTx(stargateClient, openInitChannel, 'init')
    const tryTx = await getChannelTx(stargateClient, openTryChannel, 'try')

    await context.db.OpenIbcChannel.update({
      id: openInitChannel.id,
      data: {
        polymerGas: initTx ? Number(initTx.gasUsed) : undefined,
        polymerTxHash: initTx ? initTx.hash : undefined,
        polymerBlockNumber: initTx ? BigInt(initTx.height) : undefined,
      },
    });

    await context.db.TryIbcChannel.update({
      id: openTryChannel.id,
      data: {
        polymerGas: tryTx ? Number(tryTx.gasUsed) : undefined,
        polymerTxHash: tryTx ? tryTx.hash : undefined,
        polymerBlockNumber: tryTx ? BigInt(tryTx.height) : undefined,
      },
    });

    await context.db.Channel.update({
      id: channel.id,
      data: {
        initToTryTime: Number(initToTryTime),
        initToTryPolymerGas: initTx ? Number(initTx.gasUsed) : undefined
      },
    });

    const cpChannel = await context.db.Channel.findMany({
      where: {
        portId: channel.counterpartyPortId,
        channelId: channel.counterpartyChannelId,
      }
    });

    if (cpChannel.items.length == 0) {
      logger.error(`No counterparty channel found for: ${openTryChannel.id}`);
      return;
    }

    if (cpChannel.items.length > 1) {
      logger.error(`Multiple counterparty channels found for: ${openTryChannel.id}`);
      return;
    }

    await context.db.Channel.update({
      id: cpChannel.items[0]!.id,
      data: {
        initToTryTime: Number(initToTryTime),
        initToTryPolymerGas: initTx ? Number(initTx.gasUsed) : undefined
      },
    });
  }
}

async function updateInitToAckMetrics<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, channel: Schema['Channel']) {
  const stargateClient = await TmClient.getStargate();

  if (channel.openInitChannelId && channel.openTryChannelId && channel.openAckChannelId && !channel.initToAckTime) {
    const openInitChannel = await context.db.OpenIbcChannel.findUnique({id: channel.openInitChannelId!});
    const openTryChannel = await context.db.TryIbcChannel.findUnique({id: channel.openTryChannelId!});
    const openAckChannel = await context.db.AckIbcChannel.findUnique({id: channel.openAckChannelId!});
    if (!openInitChannel) {
      logger.error(`No openInitChannel found for channel with state INIT and id: ${channel.id}`);
      return;
    }
    if (!openTryChannel) {
      logger.error(`No openTryChannel found for channel with state TRY and id: ${channel.id}`);
      return;
    }
    if (!openAckChannel) {
      logger.error(`No openAckChannel found for channel with state ACK and id: ${channel.id}`);
      return;
    }

    let initToAckTime = openAckChannel!.blockTimestamp - openInitChannel.blockTimestamp;
    const initTx = await getChannelTx(stargateClient, openInitChannel, 'init')
    const ackTx = await getChannelTx(stargateClient, openAckChannel, 'ack')

    await context.db.OpenIbcChannel.update({
      id: openInitChannel.id,
      data: {
        polymerGas: initTx ? Number(initTx.gasUsed) : undefined,
        polymerTxHash: initTx ? initTx.hash : undefined,
        polymerBlockNumber: initTx ? BigInt(initTx.height) : undefined,
      },
    });

    await context.db.AckIbcChannel.update({
      id: openAckChannel.id,
      data: {
        polymerGas: ackTx ? Number(ackTx.gasUsed) : undefined,
        polymerTxHash: ackTx ? ackTx.hash : undefined,
        polymerBlockNumber: ackTx ? BigInt(ackTx.height) : undefined,
      },
    });

    await context.db.Channel.update({
      id: channel.id,
      data: {
        initToAckTime: Number(initToAckTime),
        initToAckPolymerGas: initTx ? Number(initTx.gasUsed) + openTryChannel.polymerGas! : undefined
      },
    });

    const cpChannel = await context.db.Channel.findMany({
      where: {
        portId: channel.counterpartyPortId,
        channelId: channel.counterpartyChannelId,
      }
    });

    if (cpChannel.items.length == 0) {
      logger.error(`No counterparty channel found for: ${openAckChannel.id}`);
      return;
    }

    if (cpChannel.items.length > 1) {
      logger.error(`Multiple counterparty channels found for: ${openAckChannel.id}`);
      return;
    }

    await context.db.Channel.update({
      id: cpChannel.items[0]!.id,
      data: {
        initToAckTime: Number(initToAckTime),
        initToAckPolymerGas: initTx ? Number(initTx.gasUsed) + openTryChannel.polymerGas! : undefined
      },
    });
  }

}


async function updateInitToConfirmMetrics<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, channel: Schema['Channel']) {
  const stargateClient = await TmClient.getStargate();

  if (channel.openInitChannelId && channel.openConfirmChannelId && !channel.initToConfirmTime) {
    const openInitChannel = await context.db.OpenIbcChannel.findUnique({id: channel.openInitChannelId!});
    const openConfirmChannel = await context.db.ConfirmIbcChannel.findUnique({id: channel.openConfirmChannelId!});
    if (!openInitChannel) {
      logger.error(`No openInitChannel found for channel with state INIT and id: ${channel.id}`);
      return;
    }
    if (!openConfirmChannel) {
      logger.error(`No openConfirmChannel found for channel with state CONFIRM and id: ${channel.id}`);
      return;
    }

    let initToConfirmTime = openConfirmChannel!.blockTimestamp - openInitChannel.blockTimestamp;
    const initTx = await getChannelTx(stargateClient, openInitChannel, 'init')
    const confirmTx = await getChannelTx(stargateClient, openConfirmChannel, 'confirm')

    await context.db.OpenIbcChannel.update({
      id: openInitChannel.id,
      data: {
        polymerGas: initTx ? Number(initTx.gasUsed) : undefined,
        polymerTxHash: initTx ? initTx.hash : undefined,
        polymerBlockNumber: initTx ? BigInt(initTx.height) : undefined,
      },
    });

    await context.db.ConfirmIbcChannel.update({
      id: openConfirmChannel.id,
      data: {
        polymerGas: confirmTx ? Number(confirmTx.gasUsed) : undefined,
        polymerTxHash: confirmTx ? confirmTx.hash : undefined,
        polymerBlockNumber: confirmTx ? BigInt(confirmTx.height) : undefined,
      },
    });

    await context.db.Channel.update({
      id: channel.id,
      data: {
        initToConfirmTime: Number(initToConfirmTime),
        initToConfirmPolymerGas: initTx ? Number(initTx.gasUsed) : undefined
      },
    });

    const cpChannel = await context.db.Channel.findMany({
      where: {
        portId: channel.counterpartyPortId,
        channelId: channel.counterpartyChannelId,
      }
    });

    if (cpChannel.items.length == 0) {
      logger.error(`No counterparty channel found for: ${openConfirmChannel.id}`);
      return;
    }

    if (cpChannel.items.length > 1) {
      logger.error(`Multiple counterparty channels found for: ${openConfirmChannel.id}`);
      return;
    }

    await context.db.Channel.update({
      id: cpChannel.items[0]!.id,
      data: {
        initToConfirmTime: Number(initToConfirmTime),
        initToConfirmPolymerGas: initTx ? Number(initTx.gasUsed) : undefined
      },
    });
  }
}

async function getChannelTx(
  stargateClient: StargateClient,
  channel: Schema["OpenIbcChannel" | "TryIbcChannel" | "AckIbcChannel" | "ConfirmIbcChannel"],
  type: 'init' | 'try' | 'ack' | 'confirm'
): Promise<IndexedTx | null> {
  const txs = await stargateClient.searchTx([
    {key: `channel_open_${type}.port_id`, value: channel.portId},
    {key: `channel_open_${type}.channel_id`, value: channel.channelId},
    {key: `channel_open_${type}.counterparty_port_id`, value: channel.counterpartyPortId},
  ]);

  if (txs.length > 1) {
    console.error(`\nMultiple txs found for channel_open_${type} with channel id: ${channel.id}`);
    return null;
  }

  if (txs.length === 0) {
    console.error(`\nNo txs found for channel_open_${type}: channel_open_${type}.port_id=${channel.portId} channel_open_${type}.channel_id=${channel.channelId} channel_open_${type}.counterparty_port_id=${channel.counterpartyPortId}`);
    if (channel.channelId) {
      console.error(`\nNo polymer txs found for channel_open_${type}: ${channel.id}`);
    }
    return null;
  }

  // console.log(`FOUND for channel_open_${type}: ${channel.id} tx`)
  // txs[0]!.events.filter((event) => event.type === 'channel_open_init').forEach((event) => {
  //   event.attributes.forEach((attr) => {
  //     console.log(attr.key, attr.value)
  //   });
  // });

  return txs[0]!;
}

export async function updateChannel(context: Context, channelPk?: string) {
  if (!channelPk) {
    logger.error('No channelPk provided');
    return;
  }

  const channel = await context.db.Channel.findUnique({id: channelPk});
  if (!channel) {
    logger.error('No channel found');
    return;
  }

  await updateInitToTryMetrics(context, channel!)
  await updateInitToAckMetrics(context, channel!)
  await updateInitToConfirmMetrics(context, channel!)
}