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
  handleWriteTimeoutPacket, packetMetrics, packetSourceChannelUpdate,
  recvPacketHook,
  sendPacketHook,
  writeAckPacketHook
} from './packets'
import {
  ackChannelHook,
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
  CloseIbcChannel, Packet,
  RecvPacket,
  SendPacket,
  Stat,
  Timeout,
  WriteAckPacket,
  WriteTimeoutPacket
} from "../model";
import { Entity } from "@subsquid/typeorm-store/lib/store";
import { logger } from "../utils/logger";

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

async function updateStats(ctx: Context, statName: StatName, val: number = 0, chainId?: number) {
  if (val == 0) {
    return
  }

  const id = `${statName}`

  const stat = await ctx.store.findOneBy(Stat, {id})
  if (!stat) {
    await ctx.store.insert(new Stat({
      id: id,
      name: statName,
      val: val,
    }))
  } else {
    stat.val += val
    await ctx.store.upsert(stat)
  }
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
        const contract = new Contract(ctx, block.header, log.address)
        portPrefix = String(await contract.portPrefix())
        portPrefixCache.set(log.address, portPrefix)
      }

      const currTopic = log.topics[0]
      if (!topics.includes(currTopic)) continue

      // Packet events
      // if (currTopic === dispatcher.events.SendPacket.topic) {
      //   entities.sendPackets.push(handleSendPacket(block.header, log, portPrefix))
      // } else if (currTopic === dispatcher.events.RecvPacket.topic) {
      //   entities.recvPackets.push(handleRecvPacket(block.header, log, portPrefix))
      // } else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
      //   entities.writeAckPackets.push(handleWriteAckPacket(block.header, log, portPrefix))
      // } else if (currTopic === dispatcher.events.Acknowledgement.topic) {
      //   entities.acknowledgements.push(handleAcknowledgement(block.header, log, portPrefix))
      // } else if (currTopic === dispatcher.events.Timeout.topic) {
      //   entities.timeouts.push(handleTimeout(block.header, log, portPrefix))
      // } else if (currTopic === dispatcher.events.WriteTimeoutPacket.topic) {
      //   entities.writeTimeoutPackets.push(handleWriteTimeoutPacket(block.header, log, portPrefix))
      // }

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

  await insertNewEntities(ctx, entities);
  await postBlockChannelHook(ctx, entities)
  await postBlockPacketHook(ctx, entities)
  await updateAllStats(ctx, entities, chainId);
}

export async function postBlockChannelHook(ctx: Context, entities: Entities) {
  let channelUpdates: Channel[] = []
  let initChannels = entities.openInitIbcChannels.map((channelOpenInit) => createChannelInInitState(channelOpenInit, ctx));
  let openTryChannels = entities.openTryIbcChannels.map((channelOpenTry) => createChannelInTryState(channelOpenTry, ctx));
  channelUpdates.push(...initChannels, ...openTryChannels);
  await ctx.store.upsert(channelUpdates)

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
    channelUpdates.push(...await confirmChannelHook(channelOpenConfirm, ctx))
  }
  await ctx.store.upsert(channelUpdates)
}

const uniqueByLastOccurrence = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Map<string, T>();
  for (const item of items) {
    seen.set(item.id, item); // This will overwrite previous entries with the same id
  }
  return Array.from(seen.values());
};

export async function postBlockPacketHook(ctx: Context, entities: Entities) {
  let packetUpdates = await Promise.all(entities.sendPackets.map((sendPacket) => sendPacketHook(sendPacket, ctx)));
  packetUpdates = uniqueByLastOccurrence(packetUpdates);
  await ctx.store.upsert(packetUpdates);
  await ctx.store.upsert(packetUpdates.map(packetMetrics));

  let sendPacketUpdates = (await Promise.all(entities.sendPackets.map((sendPacket) => packetSourceChannelUpdate(sendPacket, ctx))))
    .filter((packet): packet is SendPacket => packet !== null);
  sendPacketUpdates = uniqueByLastOccurrence(sendPacketUpdates);
  await ctx.store.upsert(sendPacketUpdates);

  packetUpdates = (await Promise.all(entities.recvPackets.map((recvPacket) => recvPacketHook(recvPacket, ctx))))
    .filter((packet): packet is Packet => packet !== null);
  packetUpdates = uniqueByLastOccurrence(packetUpdates);
  await ctx.store.upsert(packetUpdates);
  await ctx.store.upsert(packetUpdates.map(packetMetrics));

  packetUpdates = (await Promise.all(entities.writeAckPackets.map((writeAckPacket) => writeAckPacketHook(writeAckPacket, ctx))))
    .filter((packet): packet is Packet => packet !== null);
  packetUpdates = uniqueByLastOccurrence(packetUpdates);
  await ctx.store.upsert(packetUpdates);
  await ctx.store.upsert(packetUpdates.map(packetMetrics));

  packetUpdates = await Promise.all(entities.acknowledgements.map((acknowledgement) => ackPacketHook(acknowledgement, ctx)));
  packetUpdates = uniqueByLastOccurrence(packetUpdates);
  await ctx.store.upsert(packetUpdates);
  await ctx.store.upsert(packetUpdates.map(packetMetrics));
}

async function insertNewEntities(ctx: Context, entities: Entities) {
  logger.info(`Inserting new entities ${entities.openInitIbcChannels.length} openInitIbcChannels; ${entities.openTryIbcChannels.length} openTryIbcChannels; ${entities.openAckIbcChannels.length} openAckIbcChannels; ${entities.openConfirmIbcChannels.length} openConfirmIbcChannels; ${entities.closeIbcChannels.length} closeIbcChannels; ${entities.channels.length} channels; ${entities.sendPackets.length} sendPackets; ${entities.writeAckPackets.length} writeAckPackets; ${entities.recvPackets.length} recvPackets; ${entities.acknowledgements.length} acknowledgements; ${entities.timeouts.length} timeouts; ${entities.writeTimeoutPackets.length} writeTimeoutPackets`)
  await ctx.store.insert(entities.openInitIbcChannels);
  await ctx.store.insert(entities.openTryIbcChannels);
  await ctx.store.insert(entities.openAckIbcChannels);
  await ctx.store.insert(entities.openConfirmIbcChannels);
  await ctx.store.insert(entities.closeIbcChannels);
  await ctx.store.insert(entities.channels);
  await ctx.store.insert(entities.sendPackets);
  await ctx.store.insert(entities.writeAckPackets);
  await ctx.store.insert(entities.recvPackets);
  await ctx.store.insert(entities.acknowledgements);
  await ctx.store.insert(entities.timeouts);
  await ctx.store.insert(entities.writeTimeoutPackets);
}

async function updateAllStats(ctx: Context, entities: Entities, chainId: number) {
  await updateStats(ctx, StatName.OpenInitChannel, entities.openInitIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenTryChannel, entities.openTryIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenAckChannel, entities.openAckIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenConfirmChannel, entities.openConfirmIbcChannels.length, chainId);
  await updateStats(ctx, StatName.CloseChannel, entities.closeIbcChannels.length, chainId);
  await updateStats(ctx, StatName.SendPackets, entities.sendPackets.length, chainId);
  await updateStats(ctx, StatName.WriteAckPacket, entities.writeAckPackets.length, chainId);
  await updateStats(ctx, StatName.RecvPackets, entities.recvPackets.length, chainId);
  await updateStats(ctx, StatName.AckPackets, entities.acknowledgements.length, chainId);
  await updateStats(ctx, StatName.Timeout, entities.timeouts.length, chainId);
  await updateStats(ctx, StatName.WriteTimeoutPacket, entities.writeTimeoutPackets.length, chainId);
}

