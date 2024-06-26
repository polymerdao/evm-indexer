import { Block, Log } from "../utils/types";
import * as fee from '../abi/fee'
import { ethers } from "ethers";
import { OpenChannelFeeDeposited, SendPacketFeeDeposited } from "../model";


export function handleSendPacketFee(block: Block, log: Log) {
  let event = fee.events.SendPacketFeeDeposited.decode(log)
  let channelId = ethers.decodeBytes32String(event.channelId)
  return new SendPacketFeeDeposited({
    channelId: channelId,
    sequence: event.sequence,
    gasLimits: event.gasLimits.map(Number),
    gasPrices: event.gasPrices.map(Number),
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