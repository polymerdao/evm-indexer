import * as models from '../model'
import { ChannelOpenAck, ChannelOpenConfirm, ChannelOpenInit, ChannelStates } from '../model'
import * as dispatcher from '../abi/dispatcher'
import { Block, Context, Log } from '../utils/types'
import { ethers } from 'ethers'
import { getDispatcherClientName, getDispatcherType } from "./helpers";

export function handleChannelOpenInit(portPrefix: string, block: Block, log: Log): ChannelOpenInit {
  let event = dispatcher.events.ChannelOpenInit.decode(log);
  let portAddress = event.recevier
  let portId = `${portPrefix}${portAddress.slice(2)}`

  return new models.ChannelOpenInit({
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

export function handleChannelOpenTry(block: Block, log: Log): models.ChannelOpenTry {
  let event = dispatcher.events.ChannelOpenTry.decode(log);
  let portAddress = event.receiver
  let counterpartyPortId = event.counterpartyPortId;
  let counterpartyChannelId = ethers.decodeBytes32String(event.counterpartyChannelId);
  const txParams = dispatcher.functions.channelOpenTry.decode(log.transaction!.input)

  return new models.ChannelOpenTry({
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
  let portAddress = event.receiver
  let channelId = ethers.decodeBytes32String(event.channelId);

  return new models.ChannelOpenAck({
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
  let portAddress = event.receiver
  const txParams = dispatcher.functions.channelOpenConfirm.decode(log.transaction!.input)

  return new models.ChannelOpenConfirm({
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

export function createChannelInInitState(channelOpenInit: models.ChannelOpenInit, ctx: Context) {
  return new models.Channel({
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
    state: models.ChannelStates.INIT,
    channelOpenInit
  });
}

export function createChannelInTryState(channelOpenTry: models.ChannelOpenTry, ctx: Context) {
  return new models.Channel({
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
    state: models.ChannelStates.TRY,
    channelOpenTry
  })
}

export async function ackChannelHook(channelOpenAck: models.ChannelOpenAck, ctx: Context) {
  let portId = channelOpenAck.portId;
  let channelId = channelOpenAck.channelId;

  // update latest INIT state record that have incomplete id
  // NOTE: there is an assumption that the latest INIT event corresponds to the current event which is not 100% correct
  const incompleteInitChannel = await ctx.store.findOneOrFail(models.Channel, {
    where: {
      portId: portId,
      channelId: '',
      state: ChannelStates.INIT
    },
    order: {blockTimestamp: "desc"},
    relations: {channelOpenInit: true}
  })

  if (!incompleteInitChannel.channelOpenInit) {
    throw new Error(`ChannelOpenInit not found for channel ${incompleteInitChannel.id}`)
  }

  // find counterparty channel
  let cpChannel = await ctx.store.findOne(models.Channel, {
    where: {counterpartyPortId: portId, counterpartyChannelId: channelId},
    relations: {channelOpenInit: true, channelOpenAck: true}
  })

  incompleteInitChannel.channelOpenInit.channelId = channelId
  incompleteInitChannel.initToConfirmTime = Number(channelOpenAck.blockTimestamp - incompleteInitChannel.channelOpenInit.blockTimestamp)
  // TODO: that should be l2 gas, not polymer gas
  // TODO: calculate polymer gas separately
  incompleteInitChannel.initToConfirmPolymerGas = Number(channelOpenAck.gas + incompleteInitChannel.channelOpenInit.gas)

  if (cpChannel) {
    cpChannel.channelOpenInit = incompleteInitChannel.channelOpenInit
    cpChannel.channelOpenAck = channelOpenAck
  }

  incompleteInitChannel.channelId = channelId
  incompleteInitChannel.state = models.ChannelStates.OPEN
  incompleteInitChannel.counterpartyPortId = channelOpenAck.counterpartyPortId
  incompleteInitChannel.counterpartyChannelId = channelOpenAck.counterpartyChannelId
  incompleteInitChannel.channelOpenInit!.counterpartyChannelId = channelOpenAck.counterpartyChannelId
  incompleteInitChannel.channelOpenInit!.counterpartyPortId = channelOpenAck.counterpartyPortId
  incompleteInitChannel.channelOpenAck = channelOpenAck
  incompleteInitChannel.initToAckTime = Number(channelOpenAck.blockTimestamp) - Number(incompleteInitChannel.channelOpenInit?.blockTimestamp)
  incompleteInitChannel.initToAckPolymerGas = Number(channelOpenAck.gas) + Number(incompleteInitChannel.channelOpenInit?.gas)

  await ctx.store.upsert(incompleteInitChannel)

  return {
    cpChannel,
    channelOpenInit: incompleteInitChannel.channelOpenInit!
  }
}

export async function confirmChannelHook(channelOpenConfirm: models.ChannelOpenConfirm, ctx: Context) {
  let portId = channelOpenConfirm.portId;
  let channelId = channelOpenConfirm.channelId;

  // find the earliest channel in TRY state
  const tryChannel = await ctx.store.findOneOrFail(models.Channel, {
    where: {
      portId: portId,
      channelId: channelId,
      state: models.ChannelStates.TRY
    },
    order: {blockTimestamp: "desc"},
    relations: {channelOpenTry: true, channelOpenInit: true}
  })

  let cpChannel = await ctx.store.findOne(models.Channel, {
    where: {counterpartyPortId: portId, counterpartyChannelId: channelId},
    relations: {channelOpenInit: true, channelOpenAck: true, channelOpenTry: true, channelOpenConfirm: true}
  })

  let entities: models.Channel[] = []
  if (cpChannel) {
    cpChannel.channelOpenTry = tryChannel.channelOpenTry
    cpChannel.channelOpenConfirm = channelOpenConfirm
    entities.push(cpChannel)

    tryChannel.channelOpenInit = cpChannel.channelOpenInit
    tryChannel.channelOpenAck = cpChannel.channelOpenAck
  }

  tryChannel.state = models.ChannelStates.OPEN
  tryChannel.channelOpenConfirm = channelOpenConfirm

  if (tryChannel.channelOpenInit) {
    tryChannel.initToConfirmTime = Number(channelOpenConfirm.blockTimestamp - tryChannel.channelOpenInit.blockTimestamp)
    // TODO: that should be l2 gas, not polymer gas
    // TODO: calculate polymer gas separately
    tryChannel.initToConfirmPolymerGas = Number(channelOpenConfirm.gas + tryChannel.channelOpenInit.gas)
  }

  entities.push(tryChannel)
  return entities
}
