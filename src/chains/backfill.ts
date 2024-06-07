import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../utils/ibc-processor'
import { topics } from '../utils/topics'
import { MAX_BATCH_CALL_SIZE, VERSION } from "./constants";
import { handler } from "../handlers/backfill";

const DISPATCHERS: string[] = [
  process.env.DISPATCHER_ADDRESS_OPTIMISM!,
]

const processor = IbcProcessor()
  .setGateway(process.env.OPTIMISM_GATEWAY!)
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    from: Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
  })
  .addLog({
    address: DISPATCHERS,
    topic0: topics,
    transaction: true
  })

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `backfill_processor_${VERSION}`
  }),
  async (ctx) => {
    await handler(ctx)
  })
