import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../../utils/ibc-processor'
import { MAX_BATCH_CALL_SIZE, VERSION } from "../constants";
import { handler } from "../../handlers/wallets";

const ADDRESSES: string[] = [
  process.env.BATCHER_ADDRESS!,
  process.env.PROPOSER_ADDRESS!,
]

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.TXS_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .addTransaction({
    from: ADDRESSES,
  })
  .addTransaction({
    to: ADDRESSES,
  })

if (process.env.TXS_GATEWAY) {
  processor = processor.setGateway(process.env.TXS_GATEWAY)
}

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `txs_processor_${VERSION}`
  }),
  async (ctx) => {
    await handler(ctx)
  })
