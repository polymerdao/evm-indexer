import { config, ponder, schema } from "@/generated";
import { ethers } from "ethers";
import { DISPATCHER_CLIENT, TmClient } from "./client";
import logger from './logger';
import { StatName, updateStats } from "./stats";
import { Virtual } from "@ponder/core";
import retry from 'async-retry';

function getAddressAndDispatcherType<name extends Virtual.EventNames<config>>(contractName: "DispatcherSim" | "DispatcherProof", context: Virtual.Context<config, schema, name>) {
  let address: `0x${string}` = "0x";
  let dispatcherType: string;
  if (contractName == "DispatcherSim") {
    address = context.contracts.DispatcherSim.address!;
    dispatcherType = "sim";
  } else {
    address = context.contracts.DispatcherProof.address!;
    dispatcherType = "proof";
  }
  return {address, dispatcherType};
}

async function openIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:OpenIbcChannel" | "DispatcherProof:OpenIbcChannel">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  let {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let counterpartyPortId = event.args.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.args.counterpartyChannelId);
  let connectionHops = event.args.connectionHops;
  let portAddress = event.args.portAddress;
  let version = event.args.version;

  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address,
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
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
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  let channelId = '';
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;
  let state: "INIT" | "TRY" = counterpartyChannelId == "" ? "INIT" : "TRY";

  if (state == "TRY") {
    const tmClient = await TmClient.getInstance();
    await retry(async bail => {
      // If anything throws within this function, it will retry
      let channel = await tmClient.ibc.channel.channel(counterpartyPortId, counterpartyChannelId);

      if (!channel.channel) {
        logger.warn('No channel found for write ack: ', counterpartyChannelId, counterpartyPortId);
        // Optionally, you can bail out on certain conditions if retrying is futile
        bail(new Error('No channel found, giving up'));
      } else {
        channelId = channel.channel.counterparty.channelId;
      }
    }, {

      retries: 3, // The maximum amount of times to retry the operation. Default is 10
      factor: 2, // The exponential factor to use. Default is 2
      minTimeout: 1000, // The number of milliseconds before starting the first retry. Default is 1000
      maxTimeout: 5000, // The maximum number of milliseconds between two retries. Default is Infinity
      // You can also specify a custom retry strategy
      // onRetry: (err, attempt) => {},
    }).catch(e => {
      logger.warn('Skipping packet for channel in openIbcChannel: ', counterpartyPortId, counterpartyChannelId);
    });
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
  await updateStats(context.db.Stat, StatName.OpenIBCChannel)
}

async function connectIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:ConnectIbcChannel" | "DispatcherProof:ConnectIbcChannel">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let channelId = ethers.decodeBytes32String(event.args.channelId);
  let portAddress = event.args.portAddress;

  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      portAddress: portAddress,
      channelId: channelId,
      chainId: chainId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  let counterpartyPortId = '';
  let counterpartyChannelId = '';
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;

  const tmClient = await TmClient.getInstance();

  await retry(async bail => {
    const channel = await tmClient.ibc.channel.channel(portId, channelId);

    if (!channel.channel) {
      logger.warn('No channel found for write ack: ', portId, channelId);
      // Use bail to immediately stop retrying under certain conditions
      bail(new Error('No channel found, giving up'));
    } else {
      counterpartyChannelId = channel.channel.counterparty.channelId;
      counterpartyPortId = channel.channel.counterparty.portId;
    }
  }, {
    retries: 3, // The maximum amount of times to retry the operation.
    factor: 2, // The exponential factor to use.
    minTimeout: 1000, // The number of milliseconds before starting the first retry.
    maxTimeout: 5000, // The maximum number of milliseconds between two retries.
    // Custom retry strategy or additional logging can be specified here
    onRetry: (err, attempt) => {
      // This is a good place to log retry attempts if needed
      logger.info(`Retry attempt ${attempt} due to error: ${err.message}`);
    },
  }).catch(e => {
    // This catch block is executed if retries are exhausted or bail was called
    logger.warn('Skipping packet for connectIbcChannel: ', portId, channelId);
  });


  // update earliest INIT state record that have incomplete id
  let channels = await context.db.Channel.findMany({
    where: {portId: portId, channelId: ""},
    orderBy: {blockTimestamp: "asc"},
    limit: 1
  });
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

  channels = await context.db.Channel.findMany({
    where: {portId: portId, channelId: channelId},
    orderBy: {blockTimestamp: "asc"},
    limit: 1
  });
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
  await updateStats(context.db.Stat, StatName.ConnectIbcChannel)
}

async function closeIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:CloseIbcChannel" | "DispatcherProof:CloseIbcChannel">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;

  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
  await updateStats(context.db.Stat, StatName.CloseIBCChannel)
}

async function ownershipTransferred<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:OwnershipTransferred" | "DispatcherProof:OwnershipTransferred">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;

  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
}

async function sendPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:SendPacket" | "DispatcherProof:SendPacket">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let srcPortAddress = event.args.sourcePortAddress;
  let sequence = event.args.sequence;
  let transactionHash = event.transaction.hash;

  logger.debug('sendPacket', sourceChannelId, sequence)
  logger.debug("sendTx", transactionHash)

  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      sourcePortAddress: srcPortAddress,
      sourceChannelId: sourceChannelId,
      packet: event.args.packet,
      sequence: sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: transactionHash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  const srcPortId = `polyibc.${client}.${srcPortAddress.slice(2)}`;
  const key = `${srcPortId}-${sourceChannelId}-${sequence}`;

  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "SENT",
      sendPacketId: event.log.id,
      sendTx: transactionHash,
    },
    update: {
      sendPacketId: event.log.id,
      sendTx: transactionHash,
    }
  });

  await updatePacket(context, key)
  await updateStats(context.db.Stat, StatName.SendPackets)
}

async function writeAckPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:WriteAckPacket" | "DispatcherProof:WriteAckPacket">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let writerPortAddress = event.args.writerPortAddress;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let sequence = event.args.sequence;
  let transactionHash = event.transaction.hash;

  logger.debug('writeAckPacket', writerChannelId, sequence)
  logger.debug("ackTx", transactionHash)

  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      writerPortAddress: writerPortAddress,
      writerChannelId: writerChannelId,
      sequence: sequence,
      ackPacketSuccess: event.args.ackPacket.success,
      ackPacketData: event.args.ackPacket.data,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: transactionHash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  const destPortId = `polyibc.${client}.${writerPortAddress.slice(2)}`;
  const tmClient = await TmClient.getInstance();
  let channel;
  try {
    channel = await tmClient.ibc.channel.channel(destPortId, writerChannelId);
  } catch (e) {
    logger.info('Skipping packet for channel in writeAckPacket: ', destPortId, writerChannelId);
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
      writeAckTx: transactionHash,
    },
    update: ({current}) => {
      let state = current.state;
      if (current.state == "SENT") {
        state = "WRITE_ACK"
      }
      return {
        writeAckPacketId: event.log.id,
        state: state,
        writeAckTx: transactionHash,
      };
    },
  });

  await updateStats(context.db.Stat, StatName.WriteAckPacket);
}

async function updatePacket<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, id: string) {
  let packet = await context.db.Packet.findUnique({id})
  if (!packet) {
    console.warn('No packet found for updatePacket', id)
    return;
  }

  if (packet.sendPacketId && packet.recvPacketId && !packet.sendToRecvTime) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const recvPacket = await context.db.RecvPacket.findUnique({id: packet.recvPacketId});
    if (sendPacket && recvPacket) {
      packet.sendToRecvTime = Number(recvPacket.blockTimestamp - sendPacket.blockTimestamp);
      packet.sendToRecvGas = Number(recvPacket.gas + sendPacket.gas);
      await context.db.Packet.update({
        id,
        data: {
          sendToRecvTime: packet.sendToRecvTime,
          sendToRecvGas: packet.sendToRecvGas,
        }
      });
    }
  }

  if (packet.sendPacketId && packet.ackPacketId && !packet.sendToAckTime) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const ackPacket = await context.db.Acknowledgement.findUnique({id: packet.ackPacketId});
    if (sendPacket && ackPacket) {
      packet.sendToAckTime = Number(ackPacket.blockTimestamp - sendPacket.blockTimestamp);
      await context.db.Packet.update({
        id,
        data: {
          sendToAckTime: packet.sendToAckTime,
        }
      });
    }
  }

  if (packet.sendPacketId && packet.recvPacketId && packet.ackPacketId && !packet.sendToAckGas) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const recvPacket = await context.db.RecvPacket.findUnique({id: packet.recvPacketId});
    const ackPacket = await context.db.Acknowledgement.findUnique({id: packet.ackPacketId});
    if (sendPacket && recvPacket && ackPacket) {
      packet.sendToAckGas = Number(ackPacket.gas + recvPacket.gas + sendPacket.gas);
      await context.db.Packet.update({
        id,
        data: {
          sendToAckGas: packet.sendToAckGas,
        }
      });
    }
  }
}

async function recvPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:RecvPacket" | "DispatcherProof:RecvPacket">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let destPortAddress = event.args.destPortAddress;

  let destChannelId = ethers.decodeBytes32String(event.args.destChannelId);
  let sequence = event.args.sequence;
  let recvTx = event.transaction.hash;

  logger.debug('recvPacket', destPortAddress, destChannelId, sequence)
  logger.debug("recvTx", recvTx)

  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      destPortAddress: destPortAddress,
      destChannelId: destChannelId,
      sequence: sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: recvTx,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  const destPortId = `polyibc.${client}.${destPortAddress.slice(2)}`;
  const tmClient = await TmClient.getInstance();
  let channel;
  try {
    channel = await tmClient.ibc.channel.channel(destPortId, destChannelId);
  } catch (e) {
    logger.info('Skipping packet for channel in recvPacket');
    return;
  }

  if (!channel.channel) {
    logger.warn('No channel found for recv: ', destPortId, destChannelId);
    return;
  }

  const key = `${channel.channel.counterparty.portId}-${channel.channel.counterparty.channelId}-${sequence}`;
  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "RECV",
      recvPacketId: event.log.id,
      recvTx: recvTx,
    },
    update: ({current}) => {
      let state = current.state;
      if (current.state == "SENT" || current.state == "WRITE_ACK") {
        state = "RECV"
      }
      return {
        recvPacketId: event.log.id,
        state: state,
        recvTx: recvTx,
      };
    },
  });

  await updatePacket(context, key)
  await updateStats(context.db.Stat, StatName.RecvPackets)
}

async function acknowledgement<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:Acknowledgement" | "DispatcherProof:Acknowledgement">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let sequence = event.args.sequence;
  let srcPortAddress = event.args.sourcePortAddress;
  let transactionHash = event.transaction.hash;

  logger.debug('acknowledgement', sourceChannelId, sequence)
  logger.debug("ackTx", transactionHash)

  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      sourcePortAddress: srcPortAddress,
      sourceChannelId: sourceChannelId,
      sequence: sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: transactionHash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  const srcPortId = `polyibc.${client}.${srcPortAddress.slice(2)}`;
  const key = `${srcPortId}-${sourceChannelId}-${sequence}`;

  await context.db.Packet.upsert({
    id: key,
    create: {
      state: "ACK",
      ackPacketId: event.log.id,
      ackTx: transactionHash,
    },
    update: {
      state: "ACK",
      ackPacketId: event.log.id,
      ackTx: transactionHash,
    }
  });

  await updatePacket(context, key)
  await updateStats(context.db.Stat, StatName.AckPackets)
}

async function timeout<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:Timeout" | "DispatcherProof:Timeout">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let transactionHash = event.transaction.hash;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let sequence = event.args.sequence;

  logger.debug('timeout', sourceChannelId, sequence)
  logger.debug("timeoutTx", transactionHash)

  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: sourceChannelId,
      sequence: sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: transactionHash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });
  await updateStats(context.db.Stat, StatName.Timeout)
}

async function writeTimeoutPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:WriteTimeoutPacket" | "DispatcherProof:WriteTimeoutPacket">, context: Virtual.Context<config, schema, name>, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType<name>(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let transactionHash = event.transaction.hash;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let writerPortAddress = event.args.writerPortAddress;
  let sequence = event.args.sequence;

  logger.debug('writeTimeoutPacket', writerChannelId, writerPortAddress, sequence)
  logger.debug("timeoutTx", transactionHash)

  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
      dispatcherClientName: client!,
      writerPortAddress: writerPortAddress,
      writerChannelId: writerChannelId,
      sequence: sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: transactionHash,
      chainId: chainId,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  await updateStats(context.db.Stat, StatName.WriteTimeoutPacket)
}

ponder.on("DispatcherSim:OpenIbcChannel", async ({event, context}) => {
  await openIbcChannel(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:OpenIbcChannel", async ({event, context}) => {
  await openIbcChannel(event, context, "DispatcherProof");
});


ponder.on("DispatcherSim:ConnectIbcChannel", async ({event, context}) => {
  await connectIbcChannel(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:ConnectIbcChannel", async ({event, context}) => {
  await connectIbcChannel(event, context, "DispatcherProof");
});
ponder.on("DispatcherSim:CloseIbcChannel", async ({event, context}) => {
  await closeIbcChannel(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:CloseIbcChannel", async ({event, context}) => {
  await closeIbcChannel(event, context, "DispatcherProof");
});

ponder.on("DispatcherSim:OwnershipTransferred", async ({event, context}) => {
  await ownershipTransferred(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:OwnershipTransferred", async ({event, context}) => {
  await ownershipTransferred(event, context, "DispatcherProof");
});


ponder.on("DispatcherSim:SendPacket", async ({event, context}) => {
  await sendPacket(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:SendPacket", async ({event, context}) => {
  await sendPacket(event, context, "DispatcherProof");
});

ponder.on("DispatcherSim:WriteAckPacket", async ({event, context}) => {
  await writeAckPacket(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:WriteAckPacket", async ({event, context}) => {
  await writeAckPacket(event, context, "DispatcherProof");
});


ponder.on("DispatcherSim:RecvPacket", async ({event, context}) => {
  await recvPacket(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:RecvPacket", async ({event, context}) => {
  await recvPacket(event, context, "DispatcherProof");
});


ponder.on("DispatcherSim:Acknowledgement", async ({event, context}) => {
  await acknowledgement(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:Acknowledgement", async ({event, context}) => {
  await acknowledgement(event, context, "DispatcherProof");
});


ponder.on("DispatcherSim:Timeout", async ({event, context}) => {
  await timeout(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:Timeout", async ({event, context}) => {
  await timeout(event, context, "DispatcherProof");
});

ponder.on("DispatcherSim:WriteTimeoutPacket", async ({event, context}) => {
  await writeTimeoutPacket(event, context, "DispatcherSim");
});

ponder.on("DispatcherProof:WriteTimeoutPacket", async ({event, context}) => {
  await writeTimeoutPacket(event, context, "DispatcherProof");
});