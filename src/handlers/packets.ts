import * as models from '../model'
import * as dispatcher from '../abi/dispatcher'
import { ethers } from 'ethers'
import { Block, Context, DispatcherInfo, Log } from '../utils/types'
import { logger } from '../utils/logger'

export function handleSendPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.SendPacket {
  let event = dispatcher.events.SendPacket.decode(log)
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId)
  const packetHash = ethers.sha256(event.packet)
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.SendPacket({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || '',
  })
}

export function handleRecvPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.RecvPacket {
  let event = dispatcher.events.RecvPacket.decode(log)
  let destChannelId = ethers.decodeBytes32String(event.destChannelId)
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.RecvPacket({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  })
}

export function handleWriteAckPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.WriteAckPacket {
  let event = dispatcher.events.WriteAckPacket.decode(log);
  let writerChannelId = ethers.decodeBytes32String(event.writerChannelId);
  const packetHash = ethers.sha256(event.ackPacket.data);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.WriteAckPacket({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });
}

export function handleAcknowledgement(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.Acknowledgement {
  let event = dispatcher.events.Acknowledgement.decode(log);
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.Acknowledgement({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });
}

export function handleTimeout(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.Timeout {
  let event = dispatcher.events.Timeout.decode(log);
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.Timeout({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });
}

export function handleWriteTimeoutPacket(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.WriteTimeoutPacket {
  let event = dispatcher.events.WriteTimeoutPacket.decode(log);
  let writerChannelId = ethers.decodeBytes32String(event.writerChannelId);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.WriteTimeoutPacket({
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
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || ''
  });
}

export async function sendPacketHook(sendPacket: models.SendPacket, ctx: Context) {
  let srcPortId = `polyibc.${sendPacket.dispatcherClientName}.${sendPacket.sourcePortAddress.slice(2)}`;
  let key = `${srcPortId}-${sendPacket.sourceChannelId}-${sendPacket.sequence}`;
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  let state = existingPacket ? existingPacket.state : models.PacketStates.SENT

  let sendToRecvTime
  if (sendPacket.blockTimestamp && existingPacket?.recvPacket?.blockTimestamp && !existingPacket?.sendToRecvTime) {
    sendToRecvTime = existingPacket.recvPacket.blockTimestamp - sendPacket.blockTimestamp
  }

  let sendToRecvGas
  if (sendPacket.gas && existingPacket?.recvPacket?.gas && !existingPacket?.sendToRecvGas) {
    sendToRecvGas = sendPacket.gas + existingPacket.recvPacket.gas
  }

  let destChain = existingPacket?.recvPacket?.dispatcherClientName
  if (!destChain) {
    try {
      const channel = await ctx.store.findOneOrFail(models.Channel, {
        where: {
          portId: srcPortId,
          channelId: sendPacket.sourceChannelId
        }
      })
      destChain = channel.counterpartyPortId.split('.')[1]
    } catch (e) {
      logger.info("Could not find channel for packet: " + key)
    }
  }

  const packet = new models.Packet({
    id: key,
    state: state,
    sendPacket: sendPacket,
    sendTx: sendPacket.transactionHash,
    sourceChain: sendPacket.dispatcherClientName,
    destChain,
    sendBlockTimestamp: sendPacket.blockTimestamp,
    sendToRecvTime,
    sendToRecvGas: sendToRecvGas ? BigInt(sendToRecvGas) : null
  });

  await ctx.store.upsert(packet)
}

export async function recvPacketHook(recvPacket: models.RecvPacket, ctx: Context) {
  let destPortId = `polyibc.${recvPacket.dispatcherClientName}.${recvPacket.destPortAddress.slice(2)}`;
  let key
  try {
    const destChannel = await ctx.store.findOneOrFail(models.Channel, {
      where: {
        portId: destPortId,
        channelId: recvPacket.destChannelId
      }
    })
    key = `${destChannel.counterpartyPortId}-${destChannel.counterpartyChannelId}-${recvPacket.sequence}`
  } catch (e) {
    console.warn("Could not find channel for recvPacket: ", recvPacket.transactionHash)
    return
  }

  let state
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  if (!existingPacket || existingPacket?.state === models.PacketStates.SENT) {
    state = models.PacketStates.RECV
  } else {
    state = existingPacket.state
  }

  let destChain = recvPacket.dispatcherClientName

  let sendToRecvTime
  if (recvPacket.blockTimestamp && existingPacket?.sendPacket?.blockTimestamp) {
    sendToRecvTime = recvPacket.blockTimestamp - existingPacket.sendPacket.blockTimestamp
  }

  let sendToRecvGas
  if (recvPacket.gas && existingPacket?.sendPacket?.gas && !existingPacket?.sendToRecvGas) {
    sendToRecvGas = recvPacket.gas + existingPacket.sendPacket.gas
  }

  const packet = new models.Packet({
    id: key,
    state,
    destChain,
    recvPacket,
    recvTx: recvPacket.transactionHash,
    sendToRecvTime,
    sendToRecvGas
  });

  await ctx.store.upsert(packet)
}

export async function writeAckPacketHook(writeAckPacket: models.WriteAckPacket, ctx: Context) {
  let destPortId = `polyibc.${writeAckPacket.dispatcherClientName}.${writeAckPacket.writerPortAddress.slice(2)}`;
  let key
  try {
    const destChannel = await ctx.store.findOneOrFail(models.Channel, {
      where: {
        portId: destPortId,
        channelId: writeAckPacket.writerChannelId
      }
    })
    key = `${destChannel.counterpartyPortId}-${destChannel.counterpartyChannelId}-${writeAckPacket.sequence}`
  } catch (e) {
    logger.warn("Could not find channel for writeAckPacket: " + writeAckPacket.transactionHash)
    return
  }

  let state
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  if (!existingPacket || existingPacket?.state === models.PacketStates.SENT || existingPacket?.state === models.PacketStates.RECV) {
    state = models.PacketStates.WRITE_ACK
  } else {
    state = existingPacket.state
  }

  const packet = new models.Packet({
    id: key,
    state: state,
    writeAckPacket: writeAckPacket,
    writeAckTx: writeAckPacket.transactionHash
  })

  await ctx.store.upsert(packet)
}

export async function ackPacketHook(ackPacket: models.Acknowledgement, ctx: Context) {
  let srcPortId = `polyibc.${ackPacket.dispatcherClientName}.${ackPacket.sourcePortAddress.slice(2)}`;
  let key = `${srcPortId}-${ackPacket.sourceChannelId}-${ackPacket.sequence}`;

  let state
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  if (existingPacket?.state === models.PacketStates.TIMEOUT || existingPacket?.state === models.PacketStates.WRITE_TIMEOUT) {
    state = existingPacket.state
  } else {
    state = models.PacketStates.ACK
  }

  let sendToAckTime
  if (ackPacket.blockTimestamp && existingPacket?.sendBlockTimestamp) {
    sendToAckTime = ackPacket.blockTimestamp - existingPacket.sendBlockTimestamp
  }

  let sendToAckGas
  if (ackPacket.gas && existingPacket?.sendPacket?.gas && existingPacket?.recvPacket?.gas) {
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
