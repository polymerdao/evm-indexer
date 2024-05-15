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

const processor = IbcProcessor()
  .setGateway(process.env.OPTIMISM_GATEWAY!)
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!)
  })
  .setBlockRange({
    // from: 11662566
    from: Math.min(
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT_START_BLOCK!)
    ),
  })
  .addLog({
    address: [...DISPATCHERS.map(d => d.address)],
    topic0: topics,
    transaction: true
  })

processor.run(new TypeormDatabase({
  supportHotBlocks: true,
  stateSchema: 'optimism_processor'}),
async (ctx) => {
  await handler(ctx, DISPATCHERS)
})
