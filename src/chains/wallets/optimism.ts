import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../../utils/ibc-processor'
import { MAX_BATCH_CALL_SIZE, VERSION } from "../constants";
import { handler } from "../../handlers/wallets";

const ADDRESSES: string[] = [
  process.env.FEE_VAULT_OPTIMISM!,
]

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    from: Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
  })
  .addTransaction({
    from: ADDRESSES,
  })
  .addTransaction({
    to: ADDRESSES,
  })

if (process.env.OPTIMISM_TXS_GATEWAY) {
  processor = processor.setGateway(process.env.OPTIMISM_TXS_GATEWAY)
}

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `optimism_txs_processor_${VERSION}`
  }),
  async (ctx) => {
    await handler(ctx)
  })
