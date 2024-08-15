import * as models from '../model'
import { Packet, PacketCatchUpError, SendPacket, WriteAckPacket } from '../model'
import * as dispatcher from '../abi/dispatcher'
import { ethers } from 'ethers'
import { Block, Context, Log } from '../utils/types'
import { getDispatcherClientName, getDispatcherType, packetToSender } from "./helpers";
import { logger } from "../utils/logger";
import { In } from "typeorm";
import { SearchTxQuery } from "@cosmjs/stargate/build/search";
import { getCosmosPolymerData, PolymerData } from "./cosmosIndexer";
import { CATCHUP_ERROR_LIMIT } from "../chains/constants";
import { Promise as Bluebird } from "bluebird";

export function handleSendPacket(block: Block, log: Log, portPrefix: string, uchEventSender: string): models.SendPacket {
  let event = dispatcher.events.SendPacket.decode(log)
  let sourceChannelId = ethers.decodeBytes32String(event.sourceChannelId)
  const packetHash = ethers.sha256(event.packet)
  const gas = BigInt(log.transaction!.gas)
  const gasPrice = log.transaction?.gasPrice ? BigInt(log.transaction.gasPrice) : null
  const maxFeePerGas = log.transaction?.maxFeePerGas ? BigInt(log.transaction.maxFeePerGas) : null
  const maxPriorityFeePerGas = log.transaction?.maxPriorityFeePerGas ? BigInt(log.transaction.maxPriorityFeePerGas) : null
  const packetDataSender = packetToSender(event.packet)

  return new models.SendPacket({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portPrefix),
    dispatcherClientName: getDispatcherClientName(portPrefix),
    sourcePortAddress: ethers.getAddress(event.sourcePortAddress),
    srcChannelId: sourceChannelId,
    packet: packetHash,
    sequence: event.sequence,
    timeoutTimestamp: event.timeoutTimestamp,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    uchEventSender,
    packetDataSender,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    from: log.transaction?.from || '',
    totalRecvFeesDeposited: BigInt(0),
    totalAckFeesDeposited: BigInt(0),
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
  let key = `${srcPortId}-${sendPacket.srcChannelId}-${sendPacket.sequence}`;
  let existingPacket = await ctx.store.findOne(models.Packet, {where: {id: key}})
  let state = existingPacket ? existingPacket.state : models.PacketStates.SENT

  return new models.Packet({
    id: key,
    state: state,
    sendPacket: sendPacket
  });
}

// update the source channel relation for the send packet after there is a Channel entity in the db
export async function packetSourceChannelUpdate(sendPacket: models.SendPacket, ctx: Context) {
  const channel = await ctx.store.findOne(models.Channel, {
    where: {
      channelId: sendPacket.srcChannelId,
    }
  })

  if (!channel) {
    logger.info(`Channel not found for send packet for channel ${sendPacket.srcChannelId}`)
    return null
  }

  sendPacket.sourceChannel = channel
  return sendPacket;
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

async function getPolymerData(query: SearchTxQuery, eventType: string): Promise<PolymerData | null> {
  const polymerData = await getCosmosPolymerData(query, eventType)
  if (polymerData) {
    return polymerData
  }

  throw new Error(`No polymer data found in juno for ${eventType} with query parameters: ${JSON.stringify(query, (key, value) => typeof value === 'bigint' ? value.toString() : value)}`)
}

async function updateSendToRecvPolymerGas(packet: Packet, ctx: Context) {
  let sendPacket = packet.sendPacket!
  const srcPortId = `polyibc.${sendPacket.dispatcherClientName}.${sendPacket.sourcePortAddress.slice(2)}`;
  const polymerData = await getPolymerData([
    {
      key: "send_packet.packet_sequence",
      value: sendPacket.sequence
    },
    {
      key: "send_packet.packet_src_port",
      value: srcPortId
    },
    {
      key: "send_packet.packet_src_channel",
      value: sendPacket.srcChannelId
    }
  ], "send_packet")

  let polymerGas = Number(polymerData!.gasUsed);
  packet.sendToRecvPolymerGas = polymerGas
  packet.sendPacket!.polymerGas = polymerGas;
  packet.sendPacket!.polymerTxHash = polymerData!.hash;
  packet.sendPacket!.polymerBlockNumber = BigInt(polymerData!.height);
}

async function updateSendToAckPolymerGas(packet: Packet, ctx: Context) {
  let writeAckPacket = packet.writeAckPacket!
  const destPortId = `polyibc.${writeAckPacket.dispatcherClientName}.${writeAckPacket.writerPortAddress.slice(2)}`;

  const polymerData = await getPolymerData([
    {
      key: "write_acknowledgement.packet_sequence",
      value: writeAckPacket.sequence
    },
    {
      key: "write_acknowledgement.packet_dst_port",
      value: destPortId
    },
    {
      key: "write_acknowledgement.packet_dst_channel",
      value: writeAckPacket.writerChannelId
    }
  ], "write_acknowledgement")

  let polymerGas = Number(polymerData!.gasUsed);
  packet.sendToAckPolymerGas = polymerGas + packet.sendToRecvPolymerGas!
  packet.writeAckPacket!.polymerGas = polymerGas;
  packet.writeAckPacket!.polymerTxHash = polymerData!.hash;
  packet.writeAckPacket!.polymerBlockNumber = BigInt(polymerData!.height);
}

async function addCatchupErrorsToPackets(packets: Packet[], ctx: Context) {
  let catchupErrors: PacketCatchUpError[] = []

  for (const packet of packets) {
    if (!packet.catchupError) {
      packet.catchupError = new PacketCatchUpError({
        id: packet.id,
        packet: packet,
        sendToRecvPolymerGas: 0,
        sendToAckPolymerGas: 0
      })
      catchupErrors.push(packet.catchupError)
    }
  }

  if (catchupErrors.length > 0) {
    ctx.log.debug(`Adding ${catchupErrors.length} catchup errors`)
    await ctx.store.upsert(catchupErrors)
  }
}

export async function packetMetrics(packetIds: string[], ctx: Context, concurrency: number = 10): Promise<void> {
  const packets = await ctx.store.find(Packet, {
    where: {id: In(packetIds)},
    relations: {sendPacket: true, recvPacket: true, ackPacket: true, writeAckPacket: true, catchupError: true},
  })

  if (packets.length == 0) {
    ctx.log.debug(`Adding metrics for ${packets.length} packets`)
    return
  }

  await addCatchupErrorsToPackets(packets, ctx);

  let sendPackets: SendPacket[] = []
  let writeAckPackets: WriteAckPacket[] = []
  const catchUpErrors = new Set<PacketCatchUpError>();

  let mapper = async (packet: models.Packet) => {
    if (!packet.sendToRecvTime && packet.sendPacket?.blockTimestamp && packet.recvPacket?.blockTimestamp) {
      packet.sendToRecvTime = Number(packet.recvPacket.blockTimestamp - packet.sendPacket.blockTimestamp) / 1000;
    }

    if (!packet.sendToRecvGas && packet.sendPacket?.gas && packet.recvPacket?.gas) {
      packet.sendToRecvGas = Number(packet.sendPacket.gas + packet.recvPacket.gas);
    }

    if (!packet.sendToAckTime && packet.ackPacket?.blockTimestamp && packet.sendPacket?.blockTimestamp) {
      packet.sendToAckTime = Number(packet.ackPacket.blockTimestamp - packet.sendPacket.blockTimestamp) / 1000;
    }

    if (!packet.sendToAckGas && packet.ackPacket?.gas && packet.sendPacket?.gas && packet.recvPacket?.gas) {
      packet.sendToAckGas = Number(packet.ackPacket.gas + packet.sendPacket.gas + packet.recvPacket.gas);
    }

    if (!packet.sendToRecvPolymerGas && packet.sendPacket && packet.recvPacket && packet.catchupError!.sendToRecvPolymerGas < CATCHUP_ERROR_LIMIT) {
      try {
        await updateSendToRecvPolymerGas(packet, ctx);
        sendPackets.push(packet.sendPacket)
      } catch (e) {
        ctx.log.error(`Error updating sendToRecvPolymerGas for ${packet.id}`)
        ctx.log.error(`${e}`)
        packet.catchupError!.sendToRecvPolymerGas += 1
        catchUpErrors.add(packet.catchupError!);
      }
    }

    if (!packet.sendToAckPolymerGas && packet.sendPacket && packet.recvPacket && packet.writeAckPacket && packet.catchupError!.sendToAckPolymerGas < CATCHUP_ERROR_LIMIT) {
      try {
        await updateSendToAckPolymerGas(packet, ctx);
        writeAckPackets.push(packet.writeAckPacket)
      } catch (e) {
        ctx.log.error(`Error updating sendToAckPolymerGas for ${packet.id}`)
        ctx.log.error(`${e}`)
        packet.catchupError!.sendToAckPolymerGas += 1
        catchUpErrors.add(packet.catchupError!);
      }
    }
  };

  await Bluebird.map(packets, mapper, {concurrency: concurrency}); // Adjust the concurrency level as needed

  await ctx.store.upsert(sendPackets);
  await ctx.store.upsert(writeAckPackets);
  await ctx.store.upsert(packets);
  await ctx.store.upsert(Array.from(catchUpErrors));
}