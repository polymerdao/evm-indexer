import * as models from '../model'
import * as dispatcher from '../abi/dispatcher'
import { DispatcherInfo } from './types'
import { topics } from './topics'
import { Context, Log, Block } from './types'
import { ethers } from 'ethers'

function handleSendPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.SendPacket {
  let event = dispatcher.events.SendPacket.decode(log)
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId)
  const packetHash = ethers.sha256(event.packet)
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const sendPacket = new models.SendPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    sourcePortAddress: event.sourcePortAddress,
    sourceChannelId,
    packet: packetHash,
    sequence: event.sequence,
    timeoutTimestamp: event.timeoutTimestamp,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || '',
  })

  return sendPacket
}

function handleRecvPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.RecvPacket {
  let event = dispatcher.events.RecvPacket.decode(log)
  let destChannelId = ethers.decodeBytes32String(event.destChannelId)
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const recvPacket = new models.RecvPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    destPortAddress: event.destPortAddress,
    destChannelId: destChannelId,
    sequence: event.sequence,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  })

  return recvPacket
}

function handleWriteAckPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.WriteAckPacket {
  let event = dispatcher.events.WriteAckPacket.decode(log);
  let writerChannelId = ethers.decodeBytes32String(event.writerChannelId);
  const packetHash = ethers.sha256(event.ackPacket.data);
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const writeAckPacket = new models.WriteAckPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    writerPortAddress: event.writerPortAddress,
    writerChannelId: writerChannelId,
    sequence: event.sequence,
    ackPacketSuccess: event.ackPacket.success,
    ackPacketData: packetHash,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });

  return writeAckPacket;
}

function handleAcknowledgement(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.Acknowledgement { 
  let event = dispatcher.events.Acknowledgement.decode(log);
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId);
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const acknowledgement = new models.Acknowledgement({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    sourcePortAddress: event.sourcePortAddress,
    sourceChannelId: sourceChannelId,
    sequence: event.sequence,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });

  return acknowledgement;
}

function handleTimeout(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.Timeout {
  let event = dispatcher.events.Timeout.decode(log);
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId);
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const timeout = new models.Timeout({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    sourcePortAddress: event.sourcePortAddress,
    sourceChannelId: sourceChannelId,
    sequence: event.sequence,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });

  return timeout;
}

function handleWriteTimeoutPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.WriteTimeoutPacket {
  let event = dispatcher.events.WriteTimeoutPacket.decode(log);
  let writerChannelId = ethers.decodeBytes32String(event.writerChannelId);
  const gas = log.transaction?.gas ? BigInt(log.transaction.gas) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  const writeTimeoutPacket = new models.WriteTimeoutPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    writerPortAddress: event.writerPortAddress,
    writerChannelId,
    sequence: event.sequence,
    timeoutHeightRevisionHeight: event.timeoutHeight.revision_height,
    timeoutHeightRevisionNumber: event.timeoutHeight.revision_number,
    timeoutTimestamp: event.timeoutTimestamp,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });

  return writeTimeoutPacket;
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
        else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
          const writeAckPacket = handleWriteAckPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(writeAckPacket)
        }
        else if (currTopic === dispatcher.events.Acknowledgement.topic) {
          const acknowledgement = handleAcknowledgement(block.header, log, dispatcherInfo)
          await ctx.store.upsert(acknowledgement)
        }
        else if (currTopic === dispatcher.events.Timeout.topic) {
          const timeout = handleTimeout(block.header, log, dispatcherInfo)
          await ctx.store.upsert(timeout)
        }
        else if (currTopic === dispatcher.events.WriteTimeoutPacket.topic) {
          const writeTimeoutPacket = handleWriteTimeoutPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(writeTimeoutPacket)
        }

      }
    }
  }
}
