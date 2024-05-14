import * as dispatcher from '../abi/dispatcher'
import { topics } from '../utils/topics'
import { Context, DispatcherInfo } from '../utils/types'
import {
  ackPacketHook,
  handleAcknowledgement,
  handleRecvPacket,
  handleSendPacket,
  handleTimeout,
  handleWriteAckPacket,
  handleWriteTimeoutPacket,
  recvPacketHook,
  sendPacketHook,
  writeAckPacketHook
} from './packets'
import {
  ackChannelHook,
  confirmChannelHook,
  handleChannelOpenAck,
  handleChannelOpenConfirm,
  handleChannelOpenInit,
  handleChannelOpenTry,
  initChannelHook,
  tryChannelHook
} from './channels'
import {
  Acknowledgement,
  Channel,
  ChannelOpenAck,
  ChannelOpenConfirm,
  ChannelOpenInit,
  ChannelOpenTry,
  CloseIbcChannel,
  RecvPacket,
  SendPacket,
  Stat,
  Timeout,
  WriteAckPacket,
  WriteTimeoutPacket
} from "../model";

export enum StatName {
  SendPackets = 'SendPackets',
  RecvPackets = 'RecvPackets',
  AckPackets = 'AckPackets',
  WriteAckPacket = 'WriteAckPacket',
  WriteTimeoutPacket = 'WriteTimeoutPacket',
  Timeout = 'Timeout',
  OpenInitIBCChannel = 'OpenInitIBCChannel',
  OpenTryIBCChannel = 'OpenTryIBCChannel',
  OpenAckIBCChannel = 'OpenAckIBCChannel',
  OpenConfirmIBCChannel = 'OpenConfirmIBCChannel',
  CloseIBCChannel = 'CloseIBCChannel',
}

async function updateStats(ctx: Context, statName: StatName, val: number = 0, chainId?: number) {
  if (val == 0) {
    return
  }

  const id = `${statName}:${chainId}`

  const stat = await ctx.store.findOneBy(Stat, {id})
  if (!stat) {
    await ctx.store.insert(new Stat({
      id: id,
      name: statName,
      val: 1,
      chainId: chainId,
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

export async function handler(ctx: Context, dispatcherInfos: DispatcherInfo[]) {
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
      for (let dispatcherInfo of dispatcherInfos) {
        if (log.address !== dispatcherInfo.address) continue

        const currTopic = log.topics[0]
        if (!topics.includes(currTopic)) continue

        // Packet events
        if (currTopic === dispatcher.events.SendPacket.topic) {
          entities.sendPackets.push(handleSendPacket(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.RecvPacket.topic) {
          entities.recvPackets.push(handleRecvPacket(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
          entities.writeAckPackets.push(handleWriteAckPacket(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.Acknowledgement.topic) {
          entities.acknowledgements.push(handleAcknowledgement(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.Timeout.topic) {
          entities.timeouts.push(handleTimeout(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.WriteTimeoutPacket.topic) {
          entities.writeTimeoutPackets.push(handleWriteTimeoutPacket(block.header, log, dispatcherInfo))
        }

        // Channel events
        else if (currTopic === dispatcher.events.ChannelOpenInit.topic) {
          entities.openInitIbcChannels.push(handleChannelOpenInit(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.ChannelOpenTry.topic) {
          entities.openTryIbcChannels.push(handleChannelOpenTry(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.ChannelOpenAck.topic) {
          entities.openAckIbcChannels.push(handleChannelOpenAck(block.header, log, dispatcherInfo))
        } else if (currTopic === dispatcher.events.ChannelOpenConfirm.topic) {
          entities.openConfirmIbcChannels.push(handleChannelOpenConfirm(block.header, log, dispatcherInfo))
        }
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
  for (let channelOpenInit of entities.openInitIbcChannels) {
    await initChannelHook(channelOpenInit, ctx)
  }
  for (let channelOpenTry of entities.openTryIbcChannels) {
    await tryChannelHook(channelOpenTry, ctx)
  }
  for (let channelOpenAck of entities.openAckIbcChannels) {
    await ackChannelHook(channelOpenAck, ctx)
  }
  for (let channelOpenConfirm of entities.openConfirmIbcChannels) {
    await confirmChannelHook(channelOpenConfirm, ctx)
  }
}

export async function postBlockPacketHook(ctx: Context, entities: Entities) {
  for (let sendPacket of entities.sendPackets) {
    await sendPacketHook(sendPacket, ctx)
  }
  for (let recvPacket of entities.recvPackets) {
    await recvPacketHook(recvPacket, ctx)
  }
  for (let writeAckPacket of entities.writeAckPackets) {
    await writeAckPacketHook(writeAckPacket, ctx)
  }
  for (let acknowledgement of entities.acknowledgements) {
    await ackPacketHook(acknowledgement, ctx)
  }
}

async function insertNewEntities(ctx: Context, entities: Entities) {
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
  await updateStats(ctx, StatName.OpenInitIBCChannel, entities.openInitIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenTryIBCChannel, entities.openTryIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenAckIBCChannel, entities.openAckIbcChannels.length, chainId);
  await updateStats(ctx, StatName.OpenConfirmIBCChannel, entities.openConfirmIbcChannels.length, chainId);
  await updateStats(ctx, StatName.CloseIBCChannel, entities.closeIbcChannels.length, chainId);
  await updateStats(ctx, StatName.SendPackets, entities.sendPackets.length, chainId);
  await updateStats(ctx, StatName.WriteAckPacket, entities.writeAckPackets.length, chainId);
  await updateStats(ctx, StatName.RecvPackets, entities.recvPackets.length, chainId);
  await updateStats(ctx, StatName.AckPackets, entities.acknowledgements.length, chainId);
  await updateStats(ctx, StatName.Timeout, entities.timeouts.length, chainId);
  await updateStats(ctx, StatName.WriteTimeoutPacket, entities.writeTimeoutPackets.length, chainId);
}

