import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'

const ibcProcessor = new EvmBatchProcessor()
  .setFields({
    log: {
      transactionHash: true
    },
    transaction: {
      gas: true,
      chainId: true
    }
  })

export type Fields = EvmBatchProcessorFields<typeof ibcProcessor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
