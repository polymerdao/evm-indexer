import { SendPacket } from '../model'
import * as Dispatcher from '../abi/dispatcher'
import { BlockData } from '@subsquid/evm-processor'
import { Log, Context } from './ibc-processor'

export interface DispatcherInfo {
  name: string;
  address: string;
  type: string;
}

async function sendPacket(block: BlockData, log: Log, dispatcherInfo: DispatcherInfo) {
  const sendPackets: SendPacket[] = []
  let {sourcePortAddress, packet, sourceChannelId, sequence, timeoutTimestamp} = Dispatcher.events.SendPacket.decode(log)

  sendPackets.push(
    new SendPacket({
      id: log.id,
      dispatcherAddress: log.address,
      dispatcherType: dispatcherInfo.type,
      dispatcherClientName: dispatcherInfo.name,
      sourceChannelId,
      sourcePortAddress,
      packet,
      sequence,
      timeoutTimestamp,
      blockNumber: block.header.height,
      blockTimestamp: BigInt(log.block.timestamp),
      transactionHash: log.transactionHash,
      chainId: log.transaction?.chainId,
      gas: log.transaction?.gas,
      from: log.transaction?.from,
    })
  )
  return sendPackets
}

export async function handleEvent(ctx: Context, dispatchers: DispatcherInfo[]) {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      for (let dispatcherInfo of dispatchers) {
        if (log.address === dispatcherInfo.address) {

          if (log.topics[0] === Dispatcher.events.SendPacket.topic) {
            await ctx.store.upsert(await sendPacket(block, log, dispatcherInfo))
          }
          if (log.topics[0] === Dispatcher.events.RecvPacket.topic) {
            // Continue with other logic here...
          }

        }
      }
    }
  }
}
