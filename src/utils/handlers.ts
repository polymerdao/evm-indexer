import { SendPacket, RecvPacket } from '../model'
import * as dispatcher from '../abi/dispatcher'
import { DispatcherInfo } from './types'
import { topics } from './topics'
import { Context, Log, Block } from '../optimism/processor'
import { ethers } from 'ethers'

function handleSendPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): SendPacket {
  let event = dispatcher.events.SendPacket.decode(log)
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId)
  let packet
  // Store hash of packet data instead
  try { packet = ethers.decodeBytes32String(event.packet) }
  catch { packet = '' }

  const sendPacket = new SendPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    sourceChannelId,
    sourcePortAddress: event.sourcePortAddress,
    packet,
    sequence: event.sequence,
    timeoutTimestamp: event.timeoutTimestamp,
    blockNumber: block.height,
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas: BigInt(log.transaction?.gas || 0),
    from: log.transaction?.from || '',
  })
  return sendPacket
}

function handleRecvPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): RecvPacket {
  let event = dispatcher.events.RecvPacket.decode(log)
  let destChannelId = ethers.decodeBytes32String(event.destChannelId)

  const recvPacket = new RecvPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    destPortAddress: event.destPortAddress,
    destChannelId: destChannelId,
    sequence: event.sequence,
    blockNumber: block.height,
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas: BigInt(log.transaction?.gas || 0),
    from: log.transaction?.from || '',
  })
  return recvPacket
}

export async function handler(ctx: Context, dispatcherInfos: DispatcherInfo[]) {

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      for (let dispatcherInfo of dispatcherInfos) {
        if (log.address !== dispatcherInfo.address) continue

        const currTopic = log.topics[0]
        if (!topics.includes(currTopic)) continue

        if (currTopic === dispatcher.events.SendPacket.topic) {
          const sendPacket = handleSendPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(sendPacket)
        }
        else if (currTopic === dispatcher.events.RecvPacket.topic) {
          const recvPacket = handleRecvPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(recvPacket)
        }

      }
    }
  }
}
