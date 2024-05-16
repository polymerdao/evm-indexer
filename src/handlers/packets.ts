import * as models from '../model'
import * as dispatcher from '../abi/dispatcher'
import { ethers } from 'ethers'
import { Block, Context, Log } from '../utils/types'
import { getDispatcherClientName, getDispatcherType } from "./helpers";
import { logger } from "../utils/logger";

export function handleSendPacket(block: Block, log: Log, portPrefix: string): models.SendPacket {
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
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    sourcePortAddress: ethers.getAddress(event.sourcePortAddress),
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

export function handleRecvPacket(block: Block, log: Log, portPrefix: string): models.RecvPacket {
  let event = dispatcher.events.RecvPacket.decode(log)
  let destChannelId = ethers.decodeBytes32String(event.destChannelId)
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.RecvPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    destPortAddress: ethers.getAddress(event.destPortAddress),
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

export function handleWriteAckPacket(block: Block, log: Log, portPrefix: string): models.WriteAckPacket {
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
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    writerPortAddress: ethers.getAddress(event.writerPortAddress),
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

export function handleAcknowledgement(block: Block, log: Log, portPrefix: string): models.Acknowledgement {
  let event = dispatcher.events.Acknowledgement.decode(log);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.Acknowledgement({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    sourcePortAddress: ethers.getAddress(event.sourcePortAddress),
    sourceChannelId: ethers.decodeBytes32String(event.sourceChannelId),
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

export function handleTimeout(block: Block, log: Log, portPrefix: string): models.Timeout {
  let event = dispatcher.events.Timeout.decode(log);
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.Timeout({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    sourcePortAddress: ethers.getAddress(event.sourcePortAddress),
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

export function handleWriteTimeoutPacket(block: Block, log: Log, portPrefix: string): models.WriteTimeoutPacket {
  let event = dispatcher.events.WriteTimeoutPacket.decode(log);
  let writerChannelId = ethers.decodeBytes32String(event.writerChannelId);
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null

  return new models.WriteTimeoutPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    writerPortAddress: ethers.getAddress(event.writerPortAddress),
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

  return new models.Packet({
    id: key,
    state: state,
    sendPacket: sendPacket,
  });
}

export async function recvPacketHook(recvPacket: models.RecvPacket, ctx: Context) {
  let destPortId = `polyibc.${recvPacket.dispatcherClientName}.${recvPacket.destPortAddress.slice(2)}`;
  let key
  const destChannel = await ctx.store.findOne(models.Channel, {
    where: {
      portId: destPortId,
      channelId: recvPacket.destChannelId
    }
  })

  if (!destChannel) {
    logger.info(`Channel not found for recv packet for port ${destPortId} and channel ${recvPacket.destChannelId}`)
    return null
  }

  key = `${destChannel.counterpartyPortId}-${destChannel.counterpartyChannelId}-${recvPacket.sequence}`

  let state
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  if (!existingPacket || existingPacket?.state === models.PacketStates.SENT) {
    state = models.PacketStates.RECV
  } else {
    state = existingPacket.state
  }

  return new models.Packet({
    id: key,
    state,
    recvPacket,
  });
}

export async function writeAckPacketHook(writeAckPacket: models.WriteAckPacket, ctx: Context) {
  let destPortId = `polyibc.${writeAckPacket.dispatcherClientName}.${writeAckPacket.writerPortAddress.slice(2)}`;
  let key
  const destChannel = await ctx.store.findOne(models.Channel, {
    where: {
      portId: destPortId,
      channelId: writeAckPacket.writerChannelId
    }
  })
  if (!destChannel) {
    logger.info(`Channel not found for write ack packet for port ${destPortId} and channel ${writeAckPacket.writerChannelId}`)
    return null
  }
  key = `${destChannel.counterpartyPortId}-${destChannel.counterpartyChannelId}-${writeAckPacket.sequence}`

  let state
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  if (!existingPacket || existingPacket?.state === models.PacketStates.SENT || existingPacket?.state === models.PacketStates.RECV) {
    state = models.PacketStates.WRITE_ACK
  } else {
    state = existingPacket.state
  }

  return new models.Packet({
    id: key,
    state: state,
    writeAckPacket: writeAckPacket,
  })
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

  return new models.Packet({
    id: key,
    state: state,
    ackPacket: ackPacket,
  });
}

export function packetMetrics(packet: models.Packet): models.Packet {
  if (!packet.sendToRecvTime && packet.sendPacket?.blockTimestamp && packet.recvPacket?.blockTimestamp) {
    packet.sendToRecvTime = packet.recvPacket.blockTimestamp - packet.sendPacket.blockTimestamp
  }

  if (!packet.sendToRecvGas && packet.sendPacket?.gas && packet.recvPacket?.gas) {
    packet.sendToRecvGas = packet.sendPacket.gas + packet.recvPacket.gas
  }

  if (!packet.sendToAckTime && packet.ackPacket?.blockTimestamp && packet.sendPacket?.blockTimestamp) {
    packet.sendToAckTime = packet.ackPacket.blockTimestamp - packet.sendPacket.blockTimestamp
  }

  if (!packet.sendToAckGas && packet.ackPacket?.gas && packet.sendPacket?.gas && packet.recvPacket?.gas) {
    packet.sendToAckGas = packet.ackPacket.gas + packet.sendPacket.gas + packet.recvPacket.gas
  }

  return packet
}
