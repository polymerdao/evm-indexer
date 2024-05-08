import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import { DispatcherInfo } from '../utils/types'
import { topics } from '../utils/topics'

export const DISPATCHERS: DispatcherInfo[] = [
  {
    address: process.env.DISPATCHER_ADDRESS_OPTIMISM!.toLowerCase(),
    clientName: 'optimism-proofs-1',
    type: 'proofs',
  },
  {
    address: process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT!.toLowerCase(),
    clientName: 'optimism-sim',
    type: 'sim',
  }
]

export const processor = new EvmBatchProcessor()
  // .setGateway(process.env.OPTIMISM_GATEWAY!)
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!)
  })
  .setFinalityConfirmation(Number(process.env.FINALITY_CONFIRMATION!))
  .setFields({
    log: {
      transactionHash: true
    },
    transaction: {
      chainId: true,
      gas: true,
    }
  })
  .setBlockRange({
    from: Math.min(
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT_START_BLOCK!)
    )
  })
  .addLog({
    address: [...DISPATCHERS.map(d => d.address)],
    topic0: topics
  })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
