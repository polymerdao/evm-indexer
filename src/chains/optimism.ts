import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../utils/ibc-processor'
import { topics } from '../utils/topics'
import { handler } from '../handlers'
import { MAX_BATCH_CALL_SIZE, VERSION } from "./constants";

const DISPATCHERS: string[] = [
  process.env.DISPATCHER_ADDRESS_OPTIMISM!,
  process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT!,
]

const processor = IbcProcessor()
  .setGateway(process.env.OPTIMISM_GATEWAY!)
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    // from: 11662566
    from: Math.min(
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
      Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT_START_BLOCK!)
    ),
  })
  .addLog({
    address: DISPATCHERS,
    topic0: topics,
    transaction: true
  })

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `optimism_processor_${VERSION}`
  }),
  async (ctx) => {
    await handler(ctx)
  })
