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

async function sendPacketHook(sendPacket: models.SendPacket, ctx: Context) {
  let srcPortId = `polyibc.${sendPacket.dispatcherClientName}.${sendPacket.sourcePortAddress.slice(2)}`;
  let key = `${srcPortId}-${sendPacket.sourceChannelId}-${sendPacket.sequence}`;
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  let state = existingPacket ? existingPacket.state : models.PacketStates.SENT

  let sendToRecvTime = null
  if (sendPacket.blockTimestamp && existingPacket?.recvPacket?.blockTimestamp && !existingPacket?.sendToRecvTime) {
    sendToRecvTime = existingPacket.recvPacket.blockTimestamp - sendPacket.blockTimestamp
  }

  let sendToRecvGas = null
  if (sendPacket.gas && existingPacket?.recvPacket?.gas && !existingPacket?.sendToRecvGas) {
    sendToRecvGas = sendPacket.gas + existingPacket.recvPacket.gas
  }

  // TODO: add dest chain via channel
  const packet = new models.Packet({
    id: key,
    state: state,
    sendPacket: sendPacket,
    sendTx: sendPacket.transactionHash,
    sourceChain: sendPacket.dispatcherClientName,
    sendBlockTimestamp: sendPacket.blockTimestamp,
    sendToRecvTime,
    sendToRecvGas: sendToRecvGas ? BigInt(sendToRecvGas) : null
  });
  
  await ctx.store.upsert(packet)
}

async function ackPacketHook(ackPacket: models.Acknowledgement, ctx: Context) {
  let srcPortId = `polyibc.${ackPacket.dispatcherClientName}.${ackPacket.sourcePortAddress.slice(2)}`;
  let key = `${srcPortId}-${ackPacket.sourceChannelId}-${ackPacket.sequence}`;
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  let state = existingPacket ? existingPacket.state : models.PacketStates.ACK

  let sendToAckTime = null
  if (ackPacket.blockTimestamp && existingPacket?.sendBlockTimestamp) {
    sendToAckTime = ackPacket.blockTimestamp - existingPacket.sendBlockTimestamp
  }

  let sendToAckGas = null
  if (ackPacket.gas && existingPacket?.sendPacket?.gas && existingPacket?.recvPacket?.gas && !existingPacket?.sendToAckGas) {
    sendToAckGas = ackPacket.gas + existingPacket.sendPacket.gas + existingPacket.recvPacket.gas
  }

  const packet = new models.Packet({
    id: key,
    state: state,
    ackPacket: ackPacket,
    ackTx: ackPacket.transactionHash,
    sendToAckTime,
    sendToAckGas: sendToAckGas ? BigInt(sendToAckGas) : null
  });

  await ctx.store.upsert(packet)
}

// function handleChannelOpenInit(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.channelOpenI {
//   let event = dispatcher.events.ChannelOpenInit.decode(log);
// 
//   const channelOpenInit = new models.ChannelOpenInit({
//     id: log.id,
//     dispatcherAddress: log.address,
//     dispatcherType: dispatcherInfo.type,
//     dispatcherClientName: dispatcherInfo.clientName,
//     portId,
//     channelId,
//     counterpartyPortId: event.counterpartyPortId,
//     counterpartyChannelId: event.counterpartyChannelId,
//     connectionHops: event.connectionHops,
//     portVersion: event.portVersion,
//     signer: log.transaction?.from || '',
//     blockNumber: BigInt(block.height),
//     blockTimestamp: BigInt(log.block.timestamp),
//     transactionHash: log.transactionHash,
//     chainId: log.transaction?.chainId || 0
//   });
// 
//   return channelOpenInit;
// }

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
        }
        else if (currTopic === dispatcher.events.WriteAckPacket.topic) {
          const writeAckPacket = handleWriteAckPacket(block.header, log, dispatcherInfo)
          await ctx.store.upsert(writeAckPacket)
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

      }
    }
  }
}
