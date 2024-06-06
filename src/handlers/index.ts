import * as dispatcher from '../abi/dispatcher'
import { Contract } from '../abi/dispatcher'
import { topics } from '../utils/topics'
import { Context } from '../utils/types'
import {
  ackPacketHook,
  handleAcknowledgement,
  handleRecvPacket,
  handleSendPacket,
  handleTimeout,
  handleWriteAckPacket,
  handleWriteTimeoutPacket,
  packetMetrics,
  packetSourceChannelUpdate,
  recvPacketHook,
  sendPacketHook,
  writeAckPacketHook
} from './packets'
import {
  ackChannelHook,
  channelMetrics,
  confirmChannelHook,
  createChannelInInitState,
  createChannelInTryState,
  handleChannelOpenAck,
  handleChannelOpenConfirm,
  handleChannelOpenInit,
  handleChannelOpenTry
} from './channels'
import {
  Acknowledgement,
  Channel,
  ChannelOpenAck,
  ChannelOpenConfirm,
  ChannelOpenInit,
  ChannelOpenTry,
  CloseIbcChannel,
  Packet,
  RecvPacket,
  SendPacket,
  Timeout,
  WriteAckPacket,
  WriteTimeoutPacket
} from "../model";
import { Entity } from "@subsquid/typeorm-store/lib/store";
import { CATCHUP_BATCH_SIZE, CATCHUP_ERROR_LIMIT, ENABLE_CATCHUP } from "../chains/constants";
import { IsNull, LessThan, Not } from "typeorm";

export enum StatName {
  SendPackets = 'SendPackets',
  RecvPackets = 'RecvPackets',
  AckPackets = 'AckPackets',
  WriteAckPacket = 'WriteAckPacket',
  WriteTimeoutPacket = 'WriteTimeoutPacket',
  Timeout = 'Timeout',
  OpenInitChannel = 'OpenInitChannel',
  OpenTryChannel = 'OpenTryChannel',
  OpenAckChannel = 'OpenAckChannel',
  OpenConfirmChannel = 'OpenConfirmChannel',
  CloseChannel = 'CloseChannel',
}

type Entities = {
  openInitIbcChannels: ChannelOpenInit[],
  openTryIbcChannels: ChannelOpenTry[],
  openAckIbcChannels: ChannelOpenAck[],
  openConfirmIbcChannels: ChannelOpenConfirm[],
  closeIbcChannels: CloseIbcChannel[],
  channels: Channel[],
  sendPackets: SendPacket[],
  writeAckPackets: WriteAckPacket[],
  recvPackets: RecvPacket[],
  acknowledgements: Acknowledgement[],
  timeouts: Timeout[],
  writeTimeoutPackets: WriteTimeoutPacket[],
}

const portPrefixCache = new Map<string, string>();

async function updateMissingChannelMetrics(ctx: Context, chainId: number) {
  const channels = await ctx.store.find(Channel, {
    take: CATCHUP_BATCH_SIZE,
    relations: {
      channelOpenInit: true,
      channelOpenTry: true,
      channelOpenAck: true,
      channelOpenConfirm: true,
      catchupError: true
    },
    where: [
      {
        initToTryPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToTryPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        catchupError: {initToTryPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      },
      {
        initToAckPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToAckPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        catchupError: {initToAckPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      },
      {
        initToConfirmPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        channelOpenConfirm: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToConfirmPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        channelOpenConfirm: Not(IsNull()),
        catchupError: {initToConfirmPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      }
    ]
  })

  const uniqueChannelIds = new Set<string>();
  for (let channel of channels) {
    uniqueChannelIds.add(channel.id);
  }

  await channelMetrics(Array.from(uniqueChannelIds), ctx);
}

async function updateMissingPacketMetrics(ctx: Context, chainId: number) {
  const whereClauses = [
    {
      sendToAckPolymerGas: IsNull(),
      sendPacket: {chainId: chainId},
      recvPacket: Not(IsNull()),
      writeAckPacket: Not(IsNull()),
      catchupError: {sendToAckPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    },
    {
      sendToAckPolymerGas: IsNull(),
      sendPacket: {chainId: chainId},
      recvPacket: Not(IsNull()),
      writeAckPacket: Not(IsNull()),
      catchupError: IsNull()
    },
    {
      sendToRecvPolymerGas: IsNull(), sendPacket: {chainId: chainId}, recvPacket: Not(IsNull()),
      catchupError: {sendToRecvPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    },
    {
      sendToRecvPolymerGas: IsNull(), sendPacket: {chainId: chainId}, recvPacket: Not(IsNull()),
      catchupError: IsNull()
    },
  ];

  const uniquePacketIds = new Set<string>();
  const startTime = Date.now();

  const packets = await ctx.store.find(Packet, {
    take: CATCHUP_BATCH_SIZE,
    where: whereClauses,
  });

  const endTime = Date.now();

  for (let packet of packets) {
    uniquePacketIds.add(packet.id);
  }

  const queryTime = endTime - startTime;
  ctx.log.debug(`Query took ${queryTime} ms.`);

  await packetMetrics(Array.from(uniquePacketIds), ctx);
}

export async function handler(ctx: Context) {
  let chainIdPromise = ctx._chain.client.call("eth_chainId")
  const entities: Entities = {
    openInitIbcChannels: [],
    openTryIbcChannels: [],
    openAckIbcChannels: [],
    openConfirmIbcChannels: [],
    closeIbcChannels: [],
    channels: [],
    sendPackets: [],
    writeAckPackets: [],
    recvPackets: [],
    acknowledgements: [],
    timeouts: [],
    writeTimeoutPackets: [],
  };

  for (let block of ctx.blocks) {
    for (let log of block.logs) {

      let portPrefix = portPrefixCache.get(log.address)
      if (!portPrefix) {
        // Get the port prefix from the last block in case the port prefix hasn't been properly set in the beginning
        let latestHeight = Number(await ctx._chain.client.call("eth_blockNumber", ["latest"]))
        const contract = new Contract(ctx, {height: latestHeight}, log.address)
        portPrefix = String(await contract.portPrefix())
        portPrefixCache.set(log.address, portPrefix)
      }

      const currTopic = log.topics[0]
      if (!topics.includes(currTopic)) continue

      // Packet events
      if (currTopic === dispatcher.events.SendPacket.topic) {
        entities.sendPackets.push(handleSendPacket(block.header, log, portPrefix))
      } else if (currTopic === dispatcher.events.RecvPacket.topic) {
        entities.recvPackets.push(handleRecvPacket(block.header, log, portPrefix))
      } else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
        entities.writeAckPackets.push(handleWriteAckPacket(block.header, log, portPrefix))
      } else if (currTopic === dispatcher.events.Acknowledgement.topic) {
        entities.acknowledgements.push(handleAcknowledgement(block.header, log, portPrefix))
      } else if (currTopic === dispatcher.events.Timeout.topic) {
        entities.timeouts.push(handleTimeout(block.header, log, portPrefix))
      } else if (currTopic === dispatcher.events.WriteTimeoutPacket.topic) {
        entities.writeTimeoutPackets.push(handleWriteTimeoutPacket(block.header, log, portPrefix))
      }

      // Channel events
      else if (currTopic === dispatcher.events.ChannelOpenInit.topic) {
        entities.openInitIbcChannels.push(handleChannelOpenInit(portPrefix, block.header, log))
      } else if (currTopic === dispatcher.events.ChannelOpenTry.topic) {
        entities.openTryIbcChannels.push(handleChannelOpenTry(block.header, log))
      } else if (currTopic === dispatcher.events.ChannelOpenAck.topic) {
        entities.openAckIbcChannels.push(handleChannelOpenAck(block.header, log))
      } else if (currTopic === dispatcher.events.ChannelOpenConfirm.topic) {
        entities.openConfirmIbcChannels.push(handleChannelOpenConfirm(block.header, log))
      }
    }
  }

  let chainId = Number(await chainIdPromise);

  await upsertNewEntities(ctx, entities);
  await postBlockChannelHook(ctx, entities)
  await postBlockPacketHook(ctx, entities)

  if (ctx.isHead && ENABLE_CATCHUP) {
    await updateMissingPacketMetrics(ctx, chainId);
    await updateMissingChannelMetrics(ctx, chainId);
  }
}

export async function postBlockChannelHook(ctx: Context, entities: Entities) {
  const uniqueChannelIds = new Set<string>();

  let channelUpdates: Channel[] = []
  let initChannels = entities.openInitIbcChannels.map(channelOpenInit => createChannelInInitState(channelOpenInit, ctx));
  let openTryChannels = entities.openTryIbcChannels.map(channelOpenTry => createChannelInTryState(channelOpenTry, ctx));
  channelUpdates.push(...initChannels, ...openTryChannels);
  await ctx.store.upsert(channelUpdates);

  initChannels.forEach(channel => uniqueChannelIds.add(channel.id));
  openTryChannels.forEach(channel => uniqueChannelIds.add(channel.id));

  channelUpdates = []
  let channelEventUpdates: Entity[] = []
  for (let channelOpenAck of entities.openAckIbcChannels) {
    let {cpChannel, channelOpenInit} = await ackChannelHook(channelOpenAck, ctx)
    if (cpChannel) {
      channelUpdates.push(cpChannel)
    }
    if (channelOpenInit) {
      channelEventUpdates.push(channelOpenInit)
    }
  }

  await ctx.store.upsert(channelUpdates)
  await ctx.store.upsert(channelEventUpdates)

  channelUpdates = []
  for (let channelOpenConfirm of entities.openConfirmIbcChannels) {
    let confirmedChannels = await confirmChannelHook(channelOpenConfirm, ctx);
    channelUpdates.push(...confirmedChannels);
    confirmedChannels.forEach(channel => uniqueChannelIds.add(channel.id));
  }
  await ctx.store.upsert(channelUpdates)

  await channelMetrics(Array.from(uniqueChannelIds), ctx);
}

// Helper function to filter out duplicates and keep only the last occurrence based on `id`
const uniqueByLastOccurrence = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Map<string, T>();
  for (const item of items) {
    seen.set(item.id, item); // This will overwrite previous entries with the same id
  }
  return Array.from(seen.values());
};

const processAndUpsertPackets = async <T extends { id: string }>(
  packets: T[],
  ctx: Context,
  hookFunction: (packet: T, ctx: Context) => Promise<any>
): Promise<string[]> => {
  let processedPackets = await Promise.all(packets.map(packet => hookFunction(packet, ctx)));
  processedPackets = processedPackets.filter((packet): packet is T => packet !== null);
  processedPackets = uniqueByLastOccurrence(processedPackets);
  await ctx.store.upsert(processedPackets);

  // Return the unique IDs of processed packets
  return processedPackets.map(packet => packet.id);
};

export async function postBlockPacketHook(ctx: Context, entities: Entities) {
  const uniquePacketIds = new Set<string>();

  let packetUpdates = await processAndUpsertPackets(entities.sendPackets, ctx, sendPacketHook);
  packetUpdates.forEach(id => uniquePacketIds.add(id));

  let sendPacketUpdates = (await Promise.all(entities.sendPackets.map(packet => packetSourceChannelUpdate(packet, ctx))))
    .filter((packet): packet is SendPacket => packet !== null);
  sendPacketUpdates = uniqueByLastOccurrence(sendPacketUpdates);
  await ctx.store.upsert(sendPacketUpdates);

  packetUpdates = await processAndUpsertPackets(entities.recvPackets, ctx, recvPacketHook);
  packetUpdates.forEach(id => uniquePacketIds.add(id));

  packetUpdates = await processAndUpsertPackets(entities.writeAckPackets, ctx, writeAckPacketHook);
  packetUpdates.forEach(id => uniquePacketIds.add(id));

  packetUpdates = await processAndUpsertPackets(entities.acknowledgements, ctx, ackPacketHook);
  packetUpdates.forEach(id => uniquePacketIds.add(id));

  await packetMetrics(Array.from(uniquePacketIds), ctx);
}

async function upsertNewEntities(ctx: Context, entities: Entities) {
  await ctx.store.upsert(entities.openInitIbcChannels);
  await ctx.store.upsert(entities.openTryIbcChannels);
  await ctx.store.upsert(entities.openAckIbcChannels);
  await ctx.store.upsert(entities.openConfirmIbcChannels);
  await ctx.store.upsert(entities.closeIbcChannels);
  await ctx.store.upsert(entities.channels);
  await ctx.store.upsert(entities.sendPackets);
  await ctx.store.upsert(entities.writeAckPackets);
  await ctx.store.upsert(entities.recvPackets);
  await ctx.store.upsert(entities.acknowledgements);
  await ctx.store.upsert(entities.timeouts);
  await ctx.store.upsert(entities.writeTimeoutPackets);
}
