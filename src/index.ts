import { config, Context, ponder } from "@/generated";
import { ethers } from "ethers";
import { DISPATCHER_CLIENT, TmClient } from "./client";
import logger from './logger';
import { StatName, updateStats } from "./stats";
import { Virtual } from "@ponder/core";
import retry from 'async-retry';
import { updatePacket } from "./packet";
import { defaultRetryOpts } from "./retry";
import { updateChannel } from "./channel";
import { default as ponderConfig } from '../ponder.config'
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

function getAddressAndDispatcherType(contractName: "DispatcherSim" | "DispatcherProof", context: Context) {
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

async function openIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:OpenIbcChannel" | "DispatcherProof:OpenIbcChannel">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  let {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let counterpartyPortId = event.args.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.args.counterpartyChannelId);
  let connectionHops = event.args.connectionHops;
  let portAddress = event.args.portAddress;
  let portId = `polyibc.${client}.${portAddress.slice(2)}`;
  let version = event.args.version;

  let channelId = '';
  let state: "INIT" | "TRY" = counterpartyChannelId == "" ? "INIT" : "TRY";
  let openInitChannelId, openTryChannelId;

  if (state == "INIT") {
    openInitChannelId = event.log.id;
  }

  if (state == "TRY") {
    openTryChannelId = event.log.id;
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
      },
      defaultRetryOpts
    ).catch(e => {
      logger.warn('Skipping packet for channel in openIbcChannel after all retry attempts');
    });
  }


  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address,
      dispatcherType: dispatcherType,
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
      openInitChannelId: openInitChannelId,
      openTryChannelId: openTryChannelId,
    }
  })

  await updateChannel(context, event.log.id)
  await updateStats(context, StatName.OpenIBCChannel)
}

async function connectIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:ConnectIbcChannel" | "DispatcherProof:ConnectIbcChannel">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let channelId = ethers.decodeBytes32String(event.args.channelId);
  let portAddress = event.args.portAddress;
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

  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType,
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
        openAckChannelId: event.log.id,
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
        channelId: channelId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
        openConfirmChannelId: event.log.id,
      }
    })
  }
  await updateStats(context, StatName.ConnectIbcChannel)
}

async function closeIbcChannel<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:CloseIbcChannel" | "DispatcherProof:CloseIbcChannel">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  const portId = `polyibc.${client}.${event.args.portAddress.slice(2)}`;

  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "0x",
      dispatcherType: dispatcherType,
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

async function sendPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:SendPacket" | "DispatcherProof:SendPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
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
  await updateStats(context, StatName.SendPackets)
}

async function writeAckPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:WriteAckPacket" | "DispatcherProof:WriteAckPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let writerPortAddress = event.args.writerPortAddress;
  let writerChannelId = ethers.decodeBytes32String(event.args.writerChannelId);
  let sequence = event.args.sequence;
  let transactionHash = event.transaction.hash;

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

  await updatePacket(context, key)
  await updateStats(context, StatName.WriteAckPacket);
}

async function recvPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:RecvPacket" | "DispatcherProof:RecvPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let destPortAddress = event.args.destPortAddress;

  let destChannelId = ethers.decodeBytes32String(event.args.destChannelId);
  let sequence = event.args.sequence;
  let recvTx = event.transaction.hash;

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
  await updateStats(context, StatName.RecvPackets)
}

async function acknowledgement<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:Acknowledgement" | "DispatcherProof:Acknowledgement">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
  let client = DISPATCHER_CLIENT[address!];
  const chainId = context.network.chainId as number;
  let sourceChannelId = ethers.decodeBytes32String(event.args.sourceChannelId);
  let sequence = event.args.sequence;
  let srcPortAddress = event.args.sourcePortAddress;
  let transactionHash = event.transaction.hash;

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
  await updateStats(context, StatName.AckPackets)
}

async function timeout<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:Timeout" | "DispatcherProof:Timeout">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
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
  await updateStats(context, StatName.Timeout)
}

async function writeTimeoutPacket<name extends Virtual.EventNames<config>>(event: Virtual.Event<config, "DispatcherSim:WriteTimeoutPacket" | "DispatcherProof:WriteTimeoutPacket">, context: Context, contractName: Virtual.ExtractContractName<name>) {
  const {address, dispatcherType} = getAddressAndDispatcherType(contractName, context);
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

  await updateStats(context, StatName.WriteTimeoutPacket)
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

// ponder.on("DispatcherProof:setup", async ({context}) => {
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

// ponder.on("DispatcherSim:Timeout", async ({event, context}) => {
//   await timeout(event, context, "DispatcherSim");
// });
//
// ponder.on("DispatcherProof:Timeout", async ({event, context}) => {
//   await timeout(event, context, "DispatcherProof");
// });
//
// ponder.on("DispatcherSim:WriteTimeoutPacket", async ({event, context}) => {
//   await writeTimeoutPacket(event, c