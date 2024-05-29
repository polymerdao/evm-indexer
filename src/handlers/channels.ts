import { Channel, ChannelOpenAck, ChannelOpenConfirm, ChannelOpenInit, ChannelOpenTry, ChannelStates } from '../model'
import * as dispatcher from '../abi/dispatcher'
import { Block, Context, Log } from '../utils/types'
import { ethers } from 'ethers'
import { getDispatcherClientName, getDispatcherType } from "./helpers";
import { logger } from "../utils/logger";
import { In, LessThan, MoreThan } from "typeorm";
import { TmClient } from "./tmclient";
import { getCosmosPolymerData, PolymerData } from "./cosmosIndexer";

export function handleChannelOpenInit(portPrefix: string, block: Block, log: Log): ChannelOpenInit {
  let event = dispatcher.events.ChannelOpenInit.decode(log);
  let portAddress = ethers.getAddress(event.recevier)
  let portId = `${portPrefix}${portAddress.slice(2)}`

  return new ChannelOpenInit({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(portId),
    dispatcherClientName: getDispatcherClientName(portId),
    portAddress,
    portId,
    counterpartyPortId: event.counterpartyPortId,
    channelId: '',
    counterpartyChannelId: '',
    version: event.version,
    ordering: event.ordering,
    connectionHops: event.connectionHops,
    feeEnabled: event.feeEnabled,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas,
  });
}

export function handleChannelOpenTry(block: Block, log: Log): ChannelOpenTry {
  let event = dispatcher.events.ChannelOpenTry.decode(log);
  let portAddress = ethers.getAddress(event.receiver)
  let counterpartyPortId = event.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.counterpartyChannelId);
  const txParams = dispatcher.functions.channelOpenTry.decode(log.transaction!.input)

  return new ChannelOpenTry({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(txParams.local.portId),
    dispatcherClientName: getDispatcherClientName(txParams.local.portId),
    portId: txParams.local.portId,
    channelId: ethers.decodeBytes32String(txParams.local.channelId),
    portAddress,
    version: event.version,
    ordering: event.ordering,
    feeEnabled: event.feeEnabled,
    connectionHops: event.connectionHops,
    counterpartyPortId: counterpartyPortId,
    counterpartyChannelId,
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas,
  })
}

export function handleChannelOpenAck(block: Block, log: Log): ChannelOpenAck {
  let event = dispatcher.events.ChannelOpenAck.decode(log);
  const txParams = dispatcher.functions.channelOpenAck.decode(log.transaction!.input)
  let portAddress = ethers.getAddress(event.receiver)
  let channelId = ethers.decodeBytes32String(event.channelId);

  return new ChannelOpenAck({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(txParams.local.portId),
    dispatcherClientName: getDispatcherClientName(txParams.local.portId),
    portId: txParams.local.portId,
    channelId,
    portAddress,
    counterpartyPortId: txParams.counterparty.portId,
    counterpartyChannelId: ethers.decodeBytes32String(txParams.counterparty.channelId),
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas
  })
}

export function handleChannelOpenConfirm(block: Block, log: Log): ChannelOpenConfirm {
  let event = dispatcher.events.ChannelOpenConfirm.decode(log);
  let portAddress = ethers.getAddress(event.receiver)
  const txParams = dispatcher.functions.channelOpenConfirm.decode(log.transaction!.input)

  return new ChannelOpenConfirm({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: getDispatcherType(txParams.local.portId),
    dispatcherClientName: getDispatcherClientName(txParams.local.portId),
    portId: txParams.local.portId,
    channelId: ethers.decodeBytes32String(txParams.local.channelId),
    portAddress,
    counterpartyPortId: txParams.counterparty.portId,
    counterpartyChannelId: ethers.decodeBytes32String(txParams.counterparty.channelId),
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas
  })
}

export function createChannelInInitState(channelOpenInit: ChannelOpenInit, ctx: Context) {
  return new Channel({
    id: channelOpenInit.id,
    portId: channelOpenInit.portId,
    channelId: channelOpenInit.channelId,
    connectionHops: channelOpenInit.connectionHops,
    version: channelOpenInit.version,
    ordering: channelOpenInit.ordering,
    counterpartyPortId: channelOpenInit.counterpartyPortId,
    counterpartyChannelId: channelOpenInit.counterpartyChannelId,
    blockNumber: channelOpenInit.blockNumber,
    blockTimestamp: channelOpenInit.blockTimestamp,
    transactionHash: channelOpenInit.transactionHash,
    state: ChannelStates.INIT,
    channelOpenInit
  });
}

export function createChannelInTryState(channelOpenTry: ChannelOpenTry, ctx: Context) {
  return new Channel({
    id: channelOpenTry.id,
    portId: channelOpenTry.portId,
    channelId: channelOpenTry.channelId,
    connectionHops: channelOpenTry.connectionHops,
    version: channelOpenTry.version,
    ordering: channelOpenTry.ordering,
    counterpartyPortId: channelOpenTry.counterpartyPortId,
    counterpartyChannelId: channelOpenTry.counterpartyChannelId,
    blockNumber: channelOpenTry.blockNumber,
    blockTimestamp: channelOpenTry.blockTimestamp,
    transactionHash: channelOpenTry.transactionHash,
    state: ChannelStates.TRY,
    channelOpenTry
  })
}

export async function ackChannelHook(channelOpenAck: ChannelOpenAck, ctx: Context) {
  let portId = channelOpenAck.portId;
  let channelId = channelOpenAck.channelId;

  // update latest INIT state record that have incomplete id
  // NOTE: there is an assumption that the latest INIT event corresponds to the current event which is not 100% correct
  const incompleteInitChannel = await ctx.store.findOne(Channel, {
    where: {
      portId: portId,
      channelId: '',
      state: ChannelStates.INIT,
      blockTimestamp: LessThan(channelOpenAck.blockTimestamp)
    },
    order: {blockTimestamp: "desc"},
    relations: {channelOpenInit: true}
  })

  if (!incompleteInitChannel) {
    logger.info(`Channel not found for ack channel where clause portId: ${portId}, channelId: '', state: ${ChannelStates.INIT}`)
    return {
      cpChannel: null,
      channelOpenInit: null
    }
  }

  if (!incompleteInitChannel.channelOpenInit) {
    throw new Error(`ChannelOpenInit not found for channel ${incompleteInitChannel.id}`)
  }

  // find counterparty channel
  let cpChannel = await ctx.store.findOne(Channel, {
    where: {
      counterpartyPortId: portId,
      counterpartyChannelId: channelId,
      blockTimestamp: MoreThan(incompleteInitChannel.blockTimestamp)
    },
    relations: {channelOpenInit: true, channelOpenAck: true}
  })

  incompleteInitChannel.channelOpenInit.channelId = channelId
  incompleteInitChannel.initToConfirmTime = Number(channelOpenAck.blockTimestamp - incompleteInitChannel.channelOpenInit.blockTimestamp) / 1000

  if (cpChannel) {
    cpChannel.channelOpenInit = incompleteInitChannel.channelOpenInit
    cpChannel.channelOpenAck = channelOpenAck
    cpChannel.cpChannel = incompleteInitChannel
    incompleteInitChannel.cpChannel = cpChannel
  }

  incompleteInitChannel.channelId = channelId
  incompleteInitChannel.state = ChannelStates.OPEN
  incompleteInitChannel.counterpartyPortId = channelOpenAck.counterpartyPortId
  incompleteInitChannel.counterpartyChannelId = channelOpenAck.counterpartyChannelId
  incompleteInitChannel.channelOpenInit!.counterpartyChannelId = channelOpenAck.counterpartyChannelId
  incompleteInitChannel.channelOpenInit!.counterpartyPortId = channelOpenAck.counterpartyPortId
  incompleteInitChannel.channelOpenAck = channelOpenAck
  incompleteInitChannel.initToAckTime = Number(channelOpenAck.blockTimestamp - incompleteInitChannel.channelOpenInit?.blockTimestamp) / 1000

  await ctx.store.upsert(incompleteInitChannel)

  return {
    cpChannel,
    channelOpenInit: incompleteInitChannel.channelOpenInit!
  }
}

export async function confirmChannelHook(channelOpenConfirm: ChannelOpenConfirm, ctx: Context) {
  let portId = channelOpenConfirm.portId;
  let channelId = channelOpenConfirm.channelId;

  // find the earliest channel in TRY state
  const tryChannel = await ctx.store.findOneOrFail(Channel, {
    where: {
      portId: portId,
      channelId: channelId,
      state: ChannelStates.TRY,
      blockTimestamp: LessThan(channelOpenConfirm.blockTimestamp)
    },
    order: {blockTimestamp: "desc"},
    relations: {channelOpenTry: true, channelOpenInit: true, channelOpenAck: true, channelOpenConfirm: true}
  })

  let cpChannel = await ctx.store.findOne(Channel, {
    where: {
      counterpartyPortId: portId,
      counterpartyChannelId: channelId,
      blockTimestamp: LessThan(channelOpenConfirm.blockTimestamp)
    },
    relations: {channelOpenInit: true, channelOpenAck: true, channelOpenTry: true, channelOpenConfirm: true}
  })

  let entities: Channel[] = []
  if (cpChannel) {
    cpChannel.channelOpenTry = tryChannel.channelOpenTry
    cpChannel.channelOpenConfirm = channelOpenConfirm
    cpChannel.cpChannel = tryChannel
    entities.push(cpChannel)

    tryChannel.cpChannel = cpChannel
    tryChannel.channelOpenInit = cpChannel.channelOpenInit
    tryChannel.channelOpenAck = cpChannel.channelOpenAck
  }

  tryChannel.state = ChannelStates.OPEN
  tryChannel.channelOpenConfirm = channelOpenConfirm

  if (tryChannel.channelOpenInit) {
    tryChannel.initToConfirmTime = Number(channelOpenConfirm.blockTimestamp - tryChannel.channelOpenInit.blockTimestamp) / 1000
  }

  entities.push(tryChannel)
  return entities
}

async function getChannelTx(
  channel: ChannelOpenInit | ChannelOpenTry | ChannelOpenAck | ChannelOpenConfirm,
  type: "init" | "try" | "ack" | "confirm"
): Promise<PolymerData | null> {
  let query = [
    {key: `channel_open_${type}.port_id`, value: channel.portId},
    {key: `channel_open_${type}.channel_id`, value: channel.channelId},
    {key: `channel_open_${type}.counterparty_port_id`, value: channel.counterpartyPortId},
  ];

  const polymerData = await getCosmosPolymerData(query, `channel_open_${type}`)
  if (polymerData) {
    return polymerData
  }

  const stargateClient = await TmClient.getStargate();

  const txs = await stargateClient.searchTx(query);

  if (txs.length > 1) {
    throw new Error(`\nMultiple txs found for channel_open_${type} with channel id: ${channel.id}`);
  }

  if (txs.length === 0) {
    throw new Error(`\nNo txs found for channel_open_${type}: channel_open_${type}.port_id=${channel.portId} channel_open_${type}.channel_id=${channel.channelId} channel_open_${type}.counterparty_port_id=${channel.counterpartyPortId}`);
  }

  return txs[0]!;
}


async function updateInitToTryMetrics(channel: Channel, ctx: Context) {
  if (!channel.channelOpenInit || !channel.channelOpenTry) {
    throw new Error(`Expected channel relations not found for channel ${channel.id}`);
  }

  const initTx = await getChannelTx(channel.channelOpenInit!, 'init')
  const tryTx = await getChannelTx(channel.channelOpenTry!, 'try')

  channel.channelOpenInit!.polymerGas = Number(initTx!.gasUsed)
  channel.channelOpenTry!.polymerGas = Number(tryTx!.gasUsed)
  channel.channelOpenInit!.polymerTxHash = initTx!.hash
  channel.channelOpenTry!.polymerTxHash = tryTx!.hash
  channel.channelOpenInit!.polymerBlockNumber = BigInt(initTx!.height)
  channel.channelOpenTry!.polymerBlockNumber = BigInt(tryTx!.height)

  let initToTryTime = channel.channelOpenTry!.blockTimestamp - channel.channelOpenInit!.blockTimestamp;
  let initToTryPolymerGas = Number(initTx!.gasUsed) + Number(tryTx!.gasUsed);

  channel.initToTryPolymerGas = initToTryPolymerGas
  channel.initToTryTime = Number(initToTryTime)

  if (channel.cpChannel) {
    channel.cpChannel.initToTryTime = Number(initToTryTime)
    channel.cpChannel.initToTryPolymerGas = initToTryPolymerGas
  }
}


async function updateInitToConfirmMetrics(channel: Channel, ctx: Context) {
  if (!channel.channelOpenInit || !channel.channelOpenConfirm || !channel.channelOpenTry || !channel.channelOpenAck) {
    throw new Error(`Expected channel relations not found for channel ${channel.id}`);
  }

  const confirmTx = await getChannelTx(channel.channelOpenConfirm, 'confirm');

  channel.channelOpenConfirm.polymerGas = Number(confirmTx?.gasUsed);
  channel.channelOpenConfirm.polymerTxHash = confirmTx?.hash;
  channel.channelOpenConfirm.polymerBlockNumber = BigInt(confirmTx!.height);

  let initToConfirmPolymerGas = Number(channel.channelOpenInit.polymerGas) + Number(channel.channelOpenTry.polymerGas) + Number(channel.channelOpenAck.polymerGas) + Number(confirmTx?.gasUsed);
  const initToConfirmTime = Number(channel.channelOpenConfirm.blockTimestamp - channel.channelOpenInit.blockTimestamp);

  channel.initToConfirmTime = initToConfirmTime / 1000; // Convert to seconds
  channel.initToConfirmPolymerGas = initToConfirmPolymerGas;

  if (channel.cpChannel) {
    channel.cpChannel.initToConfirmTime = initToConfirmTime / 1000;
    channel.cpChannel.initToConfirmPolymerGas = initToConfirmPolymerGas;
  }
}

async function updateInitToAckMetrics(channel: Channel, ctx: Context) {
  const stargateClient = await TmClient.getStargate();

  if (!channel.channelOpenInit || !channel.channelOpenAck || !channel.channelOpenTry) {
    throw new Error(`Expected channel relations not found for channel ${channel.id}`);
  }

  const ackTx = await getChannelTx(channel.channelOpenAck, 'ack');

  channel.channelOpenAck.polymerGas = Number(ackTx?.gasUsed);
  channel.channelOpenAck.polymerTxHash = ackTx?.hash;
  channel.channelOpenAck.polymerBlockNumber = BigInt(ackTx!.height);

  const initToAckTime = Number(channel.channelOpenAck.blockTimestamp - channel.channelOpenInit.blockTimestamp);
  let initToAckPolymerGas = Number(channel.channelOpenInit.polymerGas) + Number(channel.channelOpenTry.polymerGas) + Number(ackTx?.gasUsed);

  channel.initToAckTime = initToAckTime / 1000; // Convert to seconds
  channel.initToAckPolymerGas = initToAckPolymerGas;

  if (channel.cpChannel) {
    channel.cpChannel.initToAckTime = initToAckTime / 1000;
    channel.cpChannel.initToAckPolymerGas = initToAckPolymerGas;
  }
}

export async function channelMetrics(channelIds: string[], ctx: Context): Promise<void> {
  const channels = await ctx.store.find(Channel, {
    where: {id: In(channelIds)},
    relations: {
      channelOpenInit: true,
      channelOpenTry: true,
      channelOpenAck: true,
      channelOpenConfirm: true,
      cpChannel: true
    }
  });

  const initChannels = new Map<string, ChannelOpenInit>();
  const tryChannels = new Map<string, ChannelOpenTry>();
  const ackChannels = new Map<string, ChannelOpenAck>();
  const confirmChannels = new Map<string, ChannelOpenConfirm>();

  for (const channel of channels) {
    if (!channel.initToTryTime && channel.channelOpenInit && channel.channelOpenTry) {
      channel.initToTryTime = Number(channel.channelOpenTry.blockTimestamp - channel.channelOpenInit.blockTimestamp) / 1000;
    }

    if (!channel.initToConfirmTime && channel.channelOpenInit && channel.channelOpenConfirm) {
      channel.initToConfirmTime = Number(channel.channelOpenConfirm.blockTimestamp - channel.channelOpenInit.blockTimestamp) / 1000;
    }
    if (!channel.initToAckTime && channel.channelOpenInit && channel.channelOpenAck) {
      channel.initToAckTime = Number(channel.channelOpenAck.blockTimestamp - channel.channelOpenInit.blockTimestamp) / 1000;
    }

    if (!channel.initToTryGas && channel.channelOpenInit && channel.channelOpenTry) {
      channel.initToTryGas = Number(channel.channelOpenInit.gas + channel.channelOpenTry.gas);
    }
    if (!channel.initToConfirmGas && channel.channelOpenInit && channel.channelOpenConfirm && channel.channelOpenTry) {
      channel.initToConfirmGas = Number(channel.channelOpenInit.gas + channel.channelOpenTry.gas + channel.channelOpenConfirm.gas);
    }
    if (!channel.initToAckGas && channel.channelOpenInit && channel.channelOpenConfirm && channel.channelOpenTry && channel.channelOpenAck) {
      channel.initToAckGas = Number(channel.channelOpenInit.gas + channel.channelOpenTry.gas + channel.channelOpenConfirm.gas + channel.channelOpenAck.gas);
    }

    if (!channel.initToTryPolymerGas && channel.channelOpenInit && channel.channelOpenTry) {
      await updateInitToTryMetrics(channel, ctx);
      initChannels.set(channel.channelOpenInit.id, channel.channelOpenInit);
      tryChannels.set(channel.channelOpenTry.id, channel.channelOpenTry);
    }

    if (!channel.initToAckTime && channel.channelOpenInit && channel.channelOpenTry && channel.channelOpenAck) {
      await updateInitToAckMetrics(channel, ctx);
      ackChannels.set(channel.channelOpenAck.id, channel.channelOpenAck);
    }

    if (!channel.initToConfirmTime && channel.channelOpenInit && channel.channelOpenTry && channel.channelOpenAck && channel.channelOpenConfirm) {
      await updateInitToConfirmMetrics(channel, ctx);
      confirmChannels.set(channel.channelOpenConfirm.id, channel.channelOpenConfirm);
    }
  }

  await ctx.store.upsert(Array.from(initChannels.values()));
  await ctx.store.upsert(Array.from(tryChannels.values()));
  await ctx.store.upsert(Array.from(ackChannels.values()));
  await ctx.store.upsert(Array.from(confirmChannels.values()));
  await ctx.store.upsert(channels);

  const cpChannels = channels.map(c => c.cpChannel).filter(c => c !== null) as Channel[];
  await ctx.store.upsert(cpChannels);
}

