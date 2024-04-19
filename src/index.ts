import { config, Context, ponder } from "@/generated";
import { ethers } from "ethers";
import { TmClient } from "./client";
import logger from './logger';
import { StatName, updateStats } from "./stats";
import { Virtual } from "@ponder/core";
import retry from 'async-retry';
import { updatePacket } from "./packet";
import { defaultRetryOpts } from "./retry";
import { updateChannel } from "./channel";
import { QueryChannelResponse } from "cosmjs-types/ibc/core/channel/v1/query";
import { DispatcherAbi } from "../abis/Dispatcher";

async function getAddressAndClient(contractName: "sim" | "proof", context: Context) {
  const {client} = context;
  let address: `0x${string}` = context.contracts[contractName].address!;
  const portPrefix = await client.readContract({
    abi: DispatcherAbi,
    address: address,
    functionName: "portPrefix",
  });

  return {address, client: portPrefix.split('.')[1]};
}

async function channelOpenInit<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:ChannelOpenInit" | "proof:ChannelOpenInit">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let counterpartyPortId = event.args.counterpartyPortId;
  let connectionHops = event.args.connectionHops;
  let portAddress = event.args.recevier;
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;
  let version = event.args.version;

  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address,
      dispatcherType: contractName,
      dispatcherClientName: client!,
      portAddress: portAddress,
      channelId: "",
      portId: portId,
      version: version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: connectionHops,
      counterpartyPortId: counterpartyPortId,
      counterpartyChannelId: "",
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

  await context.db.Channel.create({
    id: event.log.id,
    data: {
      channelId: '',
      portId: portId,
      connectionHops: [...connectionHops],
      version: version,
      ordering: event.args.ordering,
      counterpartyPortId: counterpartyPortId,
      counterpartyChannelId: "",
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      state: "INIT",
      openInitChannelId: event.log.id,
    }
  })

  await updateStats(context, StatName.OpenIBCChannel)
}

async function channelOpenTry<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:ChannelOpenTry" | "proof:ChannelOpenTry">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let counterpartyPortId = event.args.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.args.counterpartyChannelId);
  let connectionHops = event.args.connectionHops;
  let portAddress = event.args.receiver;
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;
  let version = event.args.version;

  let channelId = '';
  let openTryChannelId = event.log.id;
  let initChannel: QueryChannelResponse;
  const tmClient = await TmClient.getInstance();

  await retry(async bail => {
      initChannel = await tmClient.ibc.channel.channel(counterpartyPortId, counterpartyChannelId);

      if (!initChannel.channel) {
        logger.warn('No initChannel found for open try: ', counterpartyChannelId, counterpartyPortId);
        bail(new Error('No initChannel found, giving up'));
      } else {
        channelId = initChannel.channel.counterparty.channelId;
      }
    },
    defaultRetryOpts
  ).catch(e => {
    logger.warn('Skipping packet for channel in channelOpenTry after all retry attempts');
  });


  await context.db.TryIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address,
      dispatcherType: contractName,
      dispatcherClientName: client!,
      portAddress: portAddress,
      portId: portId,
      channelId: channelId,
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

  const channel = await context.db.Channel.create({
    id: event.log.id,
    data: {
      channelId: channelId,
      portId: portId,
      counterpartyPortId: counterpartyPortId,
      counterpartyChannelId: counterpartyChannelId,
      connectionHops: [...connectionHops],
      version: version,
      ordering: event.args.ordering,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      state: "TRY",
      openTryChannelId: openTryChannelId,
    }
  })

  await updateChannel(context, channel.id)
  await updateStats(context, StatName.TryIBCChannel)
}

async function channelOpenAck<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:ChannelOpenAck" | "proof:ChannelOpenAck">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let channelId = ethers.decodeBytes32String(event.args.channelId);
  let portAddress = event.args.receiver;
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;

  let counterpartyPortId = '';
  let counterpartyChannelId = '';

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
    },
    defaultRetryOpts
  ).catch(e => {
    // This catch block is executed if retries are exhausted or bail was called
    logger.warn('Skipping packet for AckIbcChannel after all retry attempts');
  });

  await context.db.AckIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
      dispatcherClientName: client!,
      portId,
      counterpartyPortId,
      counterpartyChannelId,
      portAddress,
      channelId,
      chainId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  // update latest INIT state record that have incomplete id
  // NOTE: there is an assumption that the latest INIT event corresponds to the current event which is not 100% correct
  let incompleteInitChannels = await context.db.Channel.findMany({
    where: {portId: portId, channelId: "", state: "INIT", blockTimestamp: {lt: event.block.timestamp}},
    orderBy: {blockTimestamp: "desc"},
    limit: 1
  });

  let cpConfirmIbcChannels = await context.db.ConfirmIbcChannel.findMany({
    where: {portId: counterpartyPortId, channelId: counterpartyChannelId, blockTimestamp: {gt: event.block.timestamp}},
    orderBy: {blockTimestamp: "desc"},
    limit: 1
  });

  for (let channel of incompleteInitChannels.items) {
    // update a channel with INIT state that has incomplete channel id and counterparty channel id
    await context.db.OpenIbcChannel.update({
      id: channel.openInitChannelId!,
      data: {
        channelId: channelId,
        counterpartyChannelId: counterpartyChannelId,
      }
    })

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
        openAckChannelId: event.log.id,
        openConfirmChannelId: cpConfirmIbcChannels.items[0]?.id,
      }
    })

    await context.db.Channel.updateMany({
      where: {portId: counterpartyPortId, channelId: counterpartyChannelId},
      data: {
        openInitChannelId: channel.openInitChannelId,
        openAckChannelId: event.log.id,
        openConfirmChannelId: cpConfirmIbcChannels.items[0]?.id,
      }
    })
  }

  await updateStats(context, StatName.AckIbcChannel)
  await updateChannel(context, incompleteInitChannels.items[0]?.id)
}

async function confirmIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:ChannelOpenConfirm" | "proof:ChannelOpenConfirm">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let channelId = ethers.decodeBytes32String(event.args.channelId);
  let portAddress = event.args.receiver;
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;

  let counterpartyPortId = '';
  let counterpartyChannelId = '';

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
    },
    defaultRetryOpts
  ).catch(e => {
    // This catch block is executed if retries are exhausted or bail was called
    logger.warn('Skipping packet for connectIbcChannel after all retry attempts');
  });

  await context.db.ConfirmIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
      dispatcherClientName: client!,
      portId,
      counterpartyPortId,
      counterpartyChannelId,
      portAddress,
      channelId,
      chainId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      gas: Number(event.transaction.gas),
      maxFeePerGas: event.transaction.maxFeePerGas,
      maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
      from: event.transaction.from.toString(),
    },
  });

  // find the earliest channel in TRY state
  let tryChannels = await context.db.Channel.findMany({
    where: {portId: portId, channelId: channelId, state: "TRY", blockTimestamp: {lt: event.block.timestamp}},
    orderBy: {blockTimestamp: "desc"},
    limit: 1
  });

  let cpAckIbcChannels = await context.db.AckIbcChannel.findMany({
    where: {portId: counterpartyPortId, channelId: counterpartyChannelId, blockTimestamp: {lt: event.block.timestamp}},
    orderBy: {blockTimestamp: "desc"},
    limit: 1
  });

  for (let channel of tryChannels.items) {
    await context.db.Channel.update({
      id: channel.id,
      data: {
        state: "OPEN",
        channelId: channelId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
        openAckChannelId: cpAckIbcChannels.items[0]?.id,
        openConfirmChannelId: event.log.id,
      }
    })

    await context.db.Channel.updateMany({
      where: {portId: counterpartyPortId, channelId: counterpartyChannelId},
      data: {
        openTryChannelId: channel.id,
        openAckChannelId: cpAckIbcChannels.items[0]?.id,
        openConfirmChannelId: event.log.id,
      }
    })
  }

  await updateStats(context, StatName.ConfirmIbcChannel)
  await updateChannel(context, tryChannels.items[0]?.id)
}

async function closeIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:CloseIbcChannel" | "proof:CloseIbcChannel">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  const portId = `polyibc.${client}.${event.args.portAddress.slice(2)}`;

  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
      dispatcherClientName: client!,
      portAddress: event.args.portAddress,
      portId: portId,
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
  await updateStats(context, StatName.CloseIBCChannel)
}

async function sendPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:SendPacket" | "proof:SendPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
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
      dispatcherType: contractName,
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
      sendBlockTimestamp: event.block.timestamp,
    },
    update: {
      sendPacketId: event.log.id,
      sendTx: transactionHash,
      sendBlockTimestamp: event.block.timestamp,
    }
  });

  await updatePacket(context, key)
  await updateStats(context, StatName.SendPackets)
}

async function writeAckPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:WriteAckPacket" | "proof:WriteAckPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let writerPortAddress = event.args.writerPortAddress;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let sequence = event.args.sequence;
  let transactionHash = event.transaction.hash;

  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
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

  await updatePacket(context, key)
  await updateStats(context, StatName.WriteAckPacket);
}

async function recvPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:RecvPacket" | "proof:RecvPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let destPortAddress = event.args.destPortAddress;

  let destChannelId = ethers.decodeBytes32String(event.args.destChannelId);
  let sequence = event.args.sequence;
  let recvTx = event.transaction.hash;

  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
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
  await updateStats(context, StatName.RecvPackets)
}

async function acknowledgement<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:Acknowledgement" | "proof:Acknowledgement">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
  const chainId = context.network.chainId as number;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let sequence = event.args.sequence;
  let srcPortAddress = event.args.sourcePortAddress;
  let transactionHash = event.transaction.hash;

  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: contractName,
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
  await updateStats(context, StatName.AckPackets)
}

async function timeout<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:Timeout" | "proof:Timeout">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
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
      dispatcherType: contractName,
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
  await updateStats(context, StatName.Timeout)
}

async function writeTimeoutPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "sim:WriteTimeoutPacket" | "proof:WriteTimeoutPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, client} = await getAddressAndClient(contractName, context);
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
      dispatcherType: contractName,
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

  await updateStats(context, StatName.WriteTimeoutPacket)
}

ponder.on("sim:ChannelOpenInit", async ({event, context}) => {
  await channelOpenInit(event, context, "sim");
});

ponder.on("proof:ChannelOpenInit", async ({event, context}) => {
  await channelOpenInit(event, context, "proof");
});

ponder.on("sim:ChannelOpenTry", async ({event, context}) => {
  await channelOpenTry(event, context, "sim");
});

ponder.on("proof:ChannelOpenTry", async ({event, context}) => {
  await channelOpenTry(event, context, "proof");
});

ponder.on("sim:ChannelOpenAck", async ({event, context}) => {
  await channelOpenAck(event, context, "sim");
});

ponder.on("proof:ChannelOpenAck", async ({event, context}) => {
  await channelOpenAck(event, context, "proof");
});

ponder.on("sim:ChannelOpenConfirm", async ({event, context}) => {
  await confirmIbcChannel(event, context, "sim");
});

ponder.on("proof:ChannelOpenConfirm", async ({event, context}) => {
  await confirmIbcChannel(event, context, "proof");
});

ponder.on("sim:CloseIbcChannel", async ({event, context}) => {
  await closeIbcChannel(event, context, "sim");
});

ponder.on("proof:CloseIbcChannel", async ({event, context}) => {
  await closeIbcChannel(event, context, "proof");
});

ponder.on("sim:SendPacket", async ({event, context}) => {
  await sendPacket(event, context, "sim");
});

ponder.on("proof:SendPacket", async ({event, context}) => {
  await sendPacket(event, context, "proof");
});

ponder.on("sim:WriteAckPacket", async ({event, context}) => {
  await writeAckPacket(event, context, "sim");
});

ponder.on("proof:WriteAckPacket", async ({event, context}) => {
  await writeAckPacket(event, context, "proof");
});


ponder.on("sim:RecvPacket", async ({event, context}) => {
  await recvPacket(event, context, "sim");
});

ponder.on("proof:RecvPacket", async ({event, context}) => {
  await recvPacket(event, context, "proof");
});


ponder.on("sim:Acknowledgement", async ({event, context}) => {
  await acknowledgement(event, context, "sim");
});

ponder.on("proof:Acknowledgement", async ({event, context}) => {
  await acknowledgement(event, context, "proof");
});

// ponder.on("proof:setup", async ({context}) => {
//   let databaseConfig = ponderConfig.database!;
//   let common = {options: ponderConfig.options}
//   if (process.env.DATABASE_URL) {
//     let pool = new pg.Pool({
//       statement_timeout: 2 * 60 * 1000, // 2 minutes
//       connectionString: process.env.DATABASE_URL
//     });
//
//     let db = new Kysely({
//       dialect: new PostgresDialect({pool: pool}),
//       log(event) {
//         console.log(event);
//       },
//     });
//
//     await db.schema
//       .createIndex('channel')
//       .on('Channel')
//       .columns(["portId", "blockTimestamp", "openTryChannelId", "openInitChannelId", "state"])
//       .execute();
//   }
// });

// ponder.on("sim:Timeout", async ({event, context}) => {
//   await timeout(event, context, "sim");
// });
//
// ponder.on("proof:Timeout", async ({event, context}) => {
//   await timeout(event, context, "proof");
// });
//
// ponder.on("sim:WriteTimeoutPacket", async ({event, context}) => {
//   await writeTimeoutPacket(event, c