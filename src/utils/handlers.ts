import { SendPacket } from '../model'
import * as dispatcher from '../abi/dispatcher'
import { DispatcherInfo } from './types'
import { topics } from './topics'
import { Context, Log, Block } from '../optimism/processor'
import { ethers } from 'ethers'

function handleSendPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo) {
  let event = dispatcher.events.SendPacket.decode(log)
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId)
  let packet
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

export async function handler(ctx: Context, dispatcherInfos: DispatcherInfo[]) {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      for (let dispatcherInfo of dispatcherInfos) {

        if (log.address !== dispatcherInfo.address) continue
        if (!topics.includes(log.topics[0])) continue

        if (log.topics[0] === dispatcher.events.SendPacket.topic) {
          const sendPacket = handleSendPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(sendPacket)
        }
        else if (log.topics[0] === dispatcher.events.RecvPacket.topic) {
          // handleRecvPacket(block, log, dispatcherInfo)
        }

      }
    }
  }
}
