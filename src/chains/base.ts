import {
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { DispatcherInfo } from '../utils/types'
import { IbcProcessor } from '../utils/ibc-processor'
import { topics } from '../utils/topics'
import { handler } from '../handlers'

const DISPATCHERS: DispatcherInfo[] = [
  {
    address: process.env.DISPATCHER_ADDRESS_BASE!.toLowerCase(),
    clientName: 'base-proofs-1',
    type: 'proofs',
  },
  {
    address: process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT!.toLowerCase(),
    clientName: 'base-sim',
    type: 'sim',
  }
]

const processor = IbcProcessor()
  .setGateway(process.env.BASE_GATEWAY!)
  .setRpcEndpoint({
    url: process.env.BASE_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!)
  })
  .setBlockRange({
    // from: 9676707
    from: Math.min(
      Number(process.env.DISPATCHER_ADDRESS_BASE_START_BLOCK!),
      Number(process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT_START_BLOCK!)
    )
  })
  .addLog({
    address: [...DISPATCHERS.map(d => d.address)],
    topic0: topics,
    transaction: true
  })

processor.run(new TypeormDatabase({
  supportHotBlocks: true,
  stateSchema: 'base_processor'}),
async (ctx) => {
  await handler(ctx, DISPATCHERS)
})
  