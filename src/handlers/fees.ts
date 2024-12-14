import { Block, Log } from '../utils/types';
import * as fee from '../abi/fee'
import { ethers } from 'ethers';
import { OpenChannelFeeDeposited, SendPacketFeeDeposited } from '../model';


export function handleSendPacketFee(block: Block, log: Log) {
  let event = fee.events.SendPacketFeeDeposited.decode(log)
  let channelId = ethers.decodeBytes32String(event.channelId)

  if (event.gasLimits.length !== 2 || event.gasPrices.length !== 2) {
    throw new Error('Invalid gas limits or gas prices')
  }

  return new SendPacketFeeDeposited({
    id: log.id,
    channelId: channelId,
    sequence: event.sequence,
    recvGasLimit: BigInt(event.gasLimits[0]),
    recvGasPrice: BigInt(event.gasPrices[0]),
    ackGasLimit: BigInt(event.gasLimits[1]),
    ackGasPrice: BigInt(event.gasPrices[1]),
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
  });
}

export function handleOpenChannelFee(block: Block, log: Log) {
  let event = fee.events.OpenChannelFeeDeposited.decode(log)
  return new OpenChannelFeeDeposited({
    id: log.id,
    sourceAddress: event.sourceAddress,
    version: event.version,
    ordering: event.ordering,
    connectionHops: event.connectionHops,
    counterpartyPortId: event.counterpartyPortId,
    feeAmount: BigInt(event.feeAmount),
    blockNumber: BigInt(block.height),
    blockTimestamp: BigInt(log.block.timestamp),
    transactionHash: log.transactionHash,
    chainId: log.transaction?.chainId || 0,
    from: log.transaction?.from || '',
  });
}