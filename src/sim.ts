import { ponder } from "@/generated";
import { ethers } from "ethers";
import { DISPATCHER_CLIENT, TmClient } from "./client";
import logger from './logger';

ponder.on("DispatcherSim:OpenIbcChannel", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  let counterpartyPortId = event.args.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.args.counterpartyChannelId);
  let connectionHops = event.args.connectionHops;
  let portAddress = event.args.portAddress;
  let version = event.args.version;
  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      portAddress: portAddress,
      version: version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: connectionHops,
      counterpartyPortId: counterpartyPortId,
      counterpartyChannelId: counterpartyChannelId,
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

  let channelId = '';
  let client = DISPATCHER_CLIENT[address!];
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;
  let state: "INIT" | "TRY" = counterpartyChannelId == "" ? "INIT" : "TRY";

  if (state == "TRY") {
    const tmClient = await TmClient.getInstance();
    let channel;
    try {
      channel = await tmClient.ibc.channel.channel(counterpartyPortId, counterpartyChannelId);
      if (!channel.channel) {
        logger.warn('No channel found for write ack: ', counterpartyChannelId, counterpartyPortId);
      } else {
        channelId = channel.channel.counterparty.channelId;
      }
    } catch (e) {
      logger.warn('Skipping packet for channel: ', counterpartyChannelId);
    }
  }

  await context.db.Channel.create({
    id: event.log.id,
    data: {
      channelId: channelId,
      portId: portId,
      connectionHops: [...connectionHops],
      counterpartyPortId: counterpartyPortId,
      counterpartyChannelId: counterpartyChannelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      state: state,
    }
  })
});

ponder.on("DispatcherSim:ConnectIbcChannel", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  let channelId = ethers.decodeBytes32String(event.args.channelId);
  let portAddress = event.args.portAddress;
  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      portAddress: portAddress,
      channelId: channelId,
      chainId: chainId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      gas: event.transaction.gas,
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  let counterpartyPortId = '';
  let counterpartyChannelId = '';
  let client = DISPATCHER_CLIENT[address!];
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;

  const tmClient = await TmClient.getInstance();
  let channel;
  try {
    channel = await tmClient.ibc.channel.channel(portId, channelId);
    if (!channel.channel) {
      logger.warn('No channel found for write ack: ', channelId, portId);
    } else {
      counterpartyChannelId = channel.channel.counterparty.channelId;
      counterpartyPortId = channel.channel.counterparty.portId;
    }
  } catch (e) {
    logger.info('Skipping packet for channel: ', channelId);
  }

  // update earliest INIT state record that have incomplete id
  let channels = await context.db.Channel.findMany({where: {portId: portId, channelId: ""}, orderBy: {blockTimestamp: "asc"}, limit: 1});
  for (let channel of channels.items) {
    await context.db.Channel.update({
      id: channel.id,
      data: {
        channelId: channelId,
        counterpartyChannelId: counterpartyChannelId,
        counterpartyPortId: counterpartyPortId,
        state: "OPEN",
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
      }
    })
  }

  channels = await context.db.Channel.findMany({where: {portId: portId, channelId: channelId}, orderBy: {blockTimestamp: "asc"}, limit: 1});
  for (let channel of channels.items) {
    await context.db.Channel.update({
      id: channel.id,
      data: {
        state: "OPEN",
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
      }
    })
  }
});

ponder.on("DispatcherSim:CloseIbcChannel", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
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

ponder.on("DispatcherSim:OwnershipTransferred", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
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

ponder.on("DispatcherSim:SendPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let srcPortAddress = event.args.sourcePortAddress;
  let sequence = event.args.sequence;
  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      sourcePortAddress: srcPortAddress,
      sourceChannelId: sourceChannelId,
      packet: event.args.packet,
      sequence: sequence,
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
  let client = DISPATCHER_CLIENT[address!];
  const srcPortId = `polyibc.${client}.${srcPortAddress.slice(2)}`;
  const key = `${srcPortId}-${sourceChannelId}-${sequence}`;
  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "SENT",
      sendPacketId: event.log.id,
    },
    update: {
      sendPacketId: event.log.id,
    }
  });
});

ponder.on("DispatcherSim:RecvPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      destPortAddress: event.args.destPortAddress,
      destChannelId: ethers.decodeBytes32String(event.args.destChannelId),
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

ponder.on("DispatcherSim:WriteAckPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  let writerPortAddress = event.args.writerPortAddress;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let sequence = event.args.sequence;
  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
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
});

ponder.on("DispatcherSim:Acknowledgement", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let sequence = event.args.sequence;
  let srcPortAddress = event.args.sourcePortAddress;
  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      sourcePortAddress: srcPortAddress,
      sourceChannelId: sourceChannelId,
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
  let client = DISPATCHER_CLIENT[address!];
  const srcPortId = `polyibc.${client}.${srcPortAddress.slice(2)}`;
  const key = `${srcPortId}-${sourceChannelId}-${sequence}`;
  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "ACK",
      ackPacketId: event.log.id,
    },
    update: {
      ackPacketId: event.log.id,
      state: "ACK",
    }
  });
});

ponder.on("DispatcherSim:Timeout", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
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

ponder.on("DispatcherSim:WriteTimeoutPacket", async ({event, context}) => {
  const {address} = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;
  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: "sim",
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: ethers.decodeBytes32String(event.args.writerChannelId),
      sequence: event.args.sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
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
});