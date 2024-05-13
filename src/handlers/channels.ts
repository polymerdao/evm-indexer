import * as models from '../model'
import * as dispatcher from '../abi/dispatcher'
import { Context, Log, Block, DispatcherInfo } from '../utils/types'
import { ethers } from 'ethers'

export function handleChannelOpenInit(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenInit {
  let event = dispatcher.events.ChannelOpenInit.decode(log);
  let portAddress = event.recevier
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`

  const channelOpenInit = new models.ChannelOpenInit({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
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

  return channelOpenInit;
}

export function handleChannelOpenTry(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenTry {
  let event = dispatcher.events.ChannelOpenTry.decode(log);
  let portAddress = event.receiver
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`
  let counterpartyChannelId = ethers.decodeBytes32String(event.counterpartyChannelId);

  // TODO: Find channelId via counterpartPortId and counterpartyChannelId
  const channelOpenTry = new models.ChannelOpenTry({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    portId,
    channelId: '',
    portAddress,
    version: event.version,
    ordering: event.ordering,
    feeEnabled: event.feeEnabled,
    connectionHops: event.connectionHops,
    counterpartyPortId: event.counterpartyPortId,
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

  return channelOpenTry
}

export function handleChannelOpenAck(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenAck {
  let event = dispatcher.events.ChannelOpenAck.decode(log);
  let portAddress = event.receiver
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`
  let channelId = ethers.decodeBytes32String(event.channelId);

  // TODO: Find counterPartyChannelId and counterPartyPortId via channelId and portId
  const channelOpenAck = new models.ChannelOpenAck({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    portId,
    channelId,
    portAddress,
    counterpartyPortId: '',
    counterpartyChannelId: '',
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas
  })

  return channelOpenAck
}

export function handleChannelOpenConfirm(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenConfirm {
  let event = dispatcher.events.ChannelOpenConfirm.decode(log);
  let portAddress = event.receiver
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`
  let channelId = ethers.decodeBytes32String(event.channelId);

  // TODO: Find counterPartyChannelId and counterPartyPortId via channelId and portId
  const ChannelOpenConfirm = new models.ChannelOpenConfirm({
    id: log.id,
    dispatcherAddress: log.address,
    dispatcherType: dispatcherInfo.type,
    dispatcherClientName: dispatcherInfo.clientName,
    portId,
    channelId,
    portAddress,
    counterpartyPortId: '',
    counterpartyChannelId: '',
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
    gas: log.transaction?.gas,
    maxFeePerGas: log.transaction?.maxFeePerGas,
    maxPriorityFeePerGas: log.transaction?.maxPriorityFeePerGas
  })

  return ChannelOpenConfirm
}

export async function initChannelHook(channelOpenInit: models.ChannelOpenInit, ctx: Context) {
  const packet = new models.Channel({
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

  await ctx.store.upsert(packet)
}

export async function tryChannelHook(channelOpenTry: models.ChannelOpenTry, ctx: Context) {
  const existingChannel = await ctx.store.findOne(models.Channel, {where: {channelId: channelOpenTry.channelId }})

  const packet = new models.Channel({
    id: channelOpenTry.id,
    portId: channelOpenTry.portId,
    channelId: channelOpenTry.channelId,
  });
  
  await ctx.store.upsert(packet)
}

export async function ackChannelHook(channelOpenAck: models.ChannelOpenAck, ctx: Context) {
  const packet = new models.Channel({
    id: channelOpenAck.id,
    portId: channelOpenAck.portId,
    channelId: channelOpenAck.channelId,
  });
  
  await ctx.store.upsert(packet)
}

export async function confirmChannelHook(channelOpenConfirm: models.ChannelOpenConfirm, ctx: Context) {
  const packet = new models.Channel({
    id: channelOpenConfirm.id,
    portId: channelOpenConfirm.portId,
    channelId: channelOpenConfirm.channelId,
  });
  
  await ctx.store.upsert(packet)
}
