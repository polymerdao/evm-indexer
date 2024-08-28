import { IbcProcessor, TxProcessor } from './ibc-processor'
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'

const processorType = IbcProcessor()
export type Fields = EvmBatchProcessorFields<typeof processorType>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

const traceProcessorType = TxProcessor([])
export type TraceFields = EvmBatchProcessorFields<typeof traceProcessorType>
export type TraceContext = DataHandlerContext<Store, TraceFields>