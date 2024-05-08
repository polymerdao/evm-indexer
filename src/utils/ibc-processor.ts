import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'

export const IbcProcessor = new EvmBatchProcessor()
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

export type Fields = EvmBatchProcessorFields<typeof IbcProcessor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
