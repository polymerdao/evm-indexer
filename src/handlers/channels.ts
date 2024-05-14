import * as models from '../model'
import * as dispatcher from '../abi/dispatcher'
import { Block, Context, DispatcherInfo, Log } from '../utils/types'
import { ethers } from 'ethers'

export function handleChannelOpenInit(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenInit {
  let event = dispatcher.events.ChannelOpenInit.decode(log);
  let portAddress = event.recevier
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`

  return new models.ChannelOpenInit({
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

  return new models.ChannelOpenAck({
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
}

export function handleChannelOpenConfirm(block: Block, log: Log, dispatcherInfo: DispatcherInfo): models.ChannelOpenConfirm {
  let event = dispatcher.events.ChannelOpenConfirm.decode(log);
  let portAddress = event.receiver
  let portId = `polyibc.${dispatcherInfo.clientName}.${portAddress.slice(2)}`
  let channelId = ethers.decodeBytes32String(event.channelId);

  // TODO: Find counterPartyChannelId and counterPartyPortId via channelId and portId
  return new models.ChannelOpenConfirm({
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
}

export async function initChannelHook(channelOpenInit: models.ChannelOpenInit, ctx: Context) {
  const channel = new models.Channel({
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

  await ctx.store.upsert(channel)
}

export async function tryChannelHook(channelOpenTry: models.ChannelOpenTry, ctx: Context) {
  const counterPartyChannel = await ctx.store.findOne(models.Channel, {where: {
    portId: channelOpenTry.counterpartyPortId,
    channelId: ''
  }})
  if (counterPartyChannel) {
    counterPartyChannel.channelId = channelOpenTry.counterpartyChannelId
    await ctx.store.upsert(counterPartyChannel)
  }

  const channel = new models.Channel({
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
  });
  
  await ctx.store.upsert(channel)
}

export async function ackChannelHook(channelOpenAck: models.ChannelOpenAck, ctx: Context) {
  const channel = await ctx.store.findOne(models.Channel, {where: { channelId: channelOpenAck.channelId }})
  if (channel) {
    channel.state = models.ChannelStates.OPEN
    channel.channelOpenAck = channelOpenAck
    channel.initToAckTime = Number(channelOpenAck.blockTimestamp) - Number(channel.channelOpenInit?.blockTimestamp)
    channel.initToAckPolymerGas = Number(channelOpenAck.gas) + Number(channel.channelOpenInit?.gas)

    if (channel.channelOpenInit) {
      channel.initToConfirmTime = Number(channelOpenAck.blockTimestamp - channel.channelOpenInit.blockTimestamp)
      if (channel.channelOpenInit.gas && channelOpenAck.gas) {
        channel.initToConfirmPolymerGas = Number(channelOpenAck.gas + channel.channelOpenInit.gas)
      }
    }

    await ctx.store.upsert(channel)
  }
}

export async function confirmChannelHook(channelOpenConfirm: models.ChannelOpenConfirm, ctx: Context) {
  const channel = await ctx.store.findOne(models.Channel, {where: {
    portId: channelOpenConfirm.portId,
    channelId: ''
  }})
  if (channel) {
    channel.channelId = channelOpenConfirm.channelId
    channel.state = models.ChannelStates.OPEN
    channel.channelOpenConfirm = channelOpenConfirm

    if (channel.channelOpenInit) {
      channel.initToConfirmTime = Number(channelOpenConfirm.blockTimestamp - channel.channelOpenInit.blockTimestamp)
      if (channel.channelOpenInit.gas && channelOpenConfirm.gas) {
        channel.initToConfirmPolymerGas = Number(channelOpenConfirm.gas + channel.channelOpenInit.gas)
      }
    }

    await ctx.store.upsert(channel)
  }
}
