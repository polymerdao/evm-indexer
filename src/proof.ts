import { ponder } from "@/generated";
import { ethers } from "ethers";
import { DISPATCHER_CLIENT, TmClient } from "./client";
import logger from './logger';
import { StatName, updateStats } from "./stats";

ponder.on("DispatcherProof:ConnectIbcChannel", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
});

ponder.on("DispatcherProof:CloseIbcChannel", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
});

ponder.on("DispatcherProof:OwnershipTransferred", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
});

ponder.on("DispatcherProof:SendPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      packet: event.args.packet,
      sequence: event.args.sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
  await updateStats(context.db.Stat, StatName.SendPackets)
});

ponder.on("DispatcherProof:RecvPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  let destChannelId = ethers.decodeBytes32String(event.args.destChannelId);
  let destPortAddress = event.args.destPortAddress;
  let sequence = event.args.sequence;
  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      destPortAddress: destPortAddress,
      destChannelId: destChannelId,
      sequence: sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
  const tmClient = await TmClient.getInstance();
  let client = DISPATCHER_CLIENT[address!];
  let channel;
  try {
    channel = await tmClient.ibc.channel.channel(`polyibc.${client}.${destPortAddress.slice(2)}`, destChannelId);
  } catch (e) {
    logger.info('Skipping packet for channel: ', destChannelId);
    return;
  }
  if (!channel.channel) {
    logger.warn('No channel found for write ack: ', destChannelId, destPortAddress);
    return;
  }
  const key = `${channel.channel.counterparty.portId}-${channel.channel.counterparty.channelId}-${sequence}`;
  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "RECV",
      recvPacketId: event.log.id,
    },
    update: ({current}) => {
      let state = current.state;
      if (["SENT", "WRITE_ACK"].includes(current.state)) {
        state = "RECV";
      }
      return {
        recvPacketId: event.log.id,
        state: state,
      };
    },
  });
  await updateStats(context.db.Stat, StatName.RecvPackets)
});

ponder.on("DispatcherProof:WriteAckPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  let writerPortAddress = event.args.writerPortAddress;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let sequence = event.args.sequence;
  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      writerPortAddress: writerPortAddress,
      writerChannelId: writerChannelId,
      sequence: sequence,
      ackPacketSuccess: event.args.ackPacket.success,
      ackPacketData: event.args.ackPacket.data,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  let client = DISPATCHER_CLIENT[address!];
  const destPortId = `polyibc.${client}.${writerPortAddress.slice(2)}`;
  const tmClient = await TmClient.getInstance();
  let channel;
  try {
    channel = await tmClient.ibc.channel.channel(destPortId, writerChannelId);
  } catch (e) {
    logger.info('Skipping packet for channel: ', writerChannelId);
    return;
  }
  if (!channel.channel) {
    logger.warn('No channel found for write ack: ', writerChannelId, writerPortAddress);
    return;
  }
  const key = `${channel.channel.counterparty.portId}-${channel.channel.counterparty.channelId}-${sequence}`;
  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "WRITE_ACK",
      writeAckPacketId: event.log.id,
    },
    update: ({current}) => {
      let state = current.state;
      if (current.state == "SENT") {
        state = "WRITE_ACK"
      }
      return {
        writeAckPacketId: event.log.id,
        state: state,
      };
    },
  });

  await updateStats(context.db.Stat, StatName.WriteAckPacket);
});


ponder.on("DispatcherProof:Acknowledgement", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
  await updateStats(context.db.Stat, StatName.AckPackets)
});

ponder.on("DispatcherProof:Timeout", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
});

ponder.on("DispatcherProof:WriteTimeoutPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;
  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      chainId: chainId,
      dispatcherAddress: address || "0x",
      dispatcherType: "proof",
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: ethers.decodeBytes32String(event.args.writerChannelId),
      sequence: event.args.sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
});