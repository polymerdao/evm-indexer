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
