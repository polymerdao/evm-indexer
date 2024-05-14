import * as dispatcher from '../abi/dispatcher'
import { topics } from '../utils/topics'
import { Context, DispatcherInfo } from '../utils/types'
import {
  handleSendPacket,
  handleRecvPacket,
  handleWriteAckPacket,
  handleAcknowledgement,
  handleTimeout,
  handleWriteTimeoutPacket,
  sendPacketHook,
  recvPacketHook,
  writeAckPacketHook,
  ackPacketHook
} from './packets'
import {
  handleChannelOpenInit,
  handleChannelOpenTry,
  handleChannelOpenAck,
  handleChannelOpenConfirm,
  initChannelHook,
  tryChannelHook,
  ackChannelHook,
  confirmChannelHook
} from './channels'
import { Stat } from "../model";

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

async function updateStats(ctx: Context, statName: StatName, val: number = 1, chainId?: number) {
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


export async function handler(ctx: Context, dispatcherInfos: DispatcherInfo[]) {

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      for (let dispatcherInfo of dispatcherInfos) {
        if (log.address !== dispatcherInfo.address) continue

        const currTopic = log.topics[0]
        if (!topics.includes(currTopic)) continue

        // Packet events
        if (currTopic === dispatcher.events.SendPacket.topic) {
          const sendPacket = handleSendPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(sendPacket)
          await sendPacketHook(sendPacket, ctx)
        }
        else if (currTopic === dispatcher.events.RecvPacket.topic) {
          const recvPacket = handleRecvPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(recvPacket)
          await recvPacketHook(recvPacket, ctx)
        }
        else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
          const writeAckPacket = handleWriteAckPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(writeAckPacket)
          await writeAckPacketHook(writeAckPacket, ctx)
        }
        else if (currTopic === dispatcher.events.Acknowledgement.topic) {
          const acknowledgement = handleAcknowledgement(block.header, log, dispatcherInfo)
          await ctx.store.upsert(acknowledgement)
          await ackPacketHook(acknowledgement, ctx)
        }
        else if (currTopic === dispatcher.events.Timeout.topic) {
          const timeout = handleTimeout(block.header, log, dispatcherInfo)
          await ctx.store.upsert(timeout)
        }
        else if (currTopic === dispatcher.events.WriteTimeoutPacket.topic) {
          const writeTimeoutPacket = handleWriteTimeoutPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(writeTimeoutPacket)
        }

        // Channel events
        else if (currTopic === dispatcher.events.ChannelOpenInit.topic) {
          const channelOpenInit = handleChannelOpenInit(block.header, log, dispatcherInfo)
          await ctx.store.upsert(channelOpenInit)
          await initChannelHook(channelOpenInit, ctx)
        }
        else if (currTopic === dispatcher.events.ChannelOpenTry.topic) {
          const channelOpenTry = handleChannelOpenTry(block.header, log, dispatcherInfo)
          await ctx.store.upsert(channelOpenTry)
          // await tryChannelHook(channelOpenTry, ctx)
        }
        else if (currTopic === dispatcher.events.ChannelOpenAck.topic) {
          const channelOpenAck = handleChannelOpenAck(block.header, log, dispatcherInfo)
          await ctx.store.upsert(channelOpenAck)
          // await ackChannelHook(channelOpenAck, ctx)
        }
        else if (currTopic === dispatcher.events.ChannelOpenConfirm.topic) {
          const ChannelOpenConfirm = handleChannelOpenConfirm(block.header, log, dispatcherInfo)
          await ctx.store.upsert(ChannelOpenConfirm)
          // await confirmChannelHook(ChannelOpenConfirm, ctx)
        }
      }
    }
  }
}
