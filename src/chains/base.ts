import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../utils/ibc-processor'
import { topics } from '../utils/topics'
import { handler } from '../handlers'

const DISPATCHERS: string[] = [
  process.env.DISPATCHER_ADDRESS_BASE!,
  process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT!,
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
    address: DISPATCHERS,
    topic0: topics,
    transaction: true
  })

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: 'base_processor'
  }),
  async (ctx) => {
    await handler(ctx)
  })
  