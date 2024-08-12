import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../../utils/ibc-processor'
import { MAX_BATCH_CALL_SIZE, VERSION } from "../constants";
import { handler } from "../../handlers/wallets";

const ADDRESSES: string[] = [
  process.env.FEE_VAULT_BASE!,
  process.env.RELAYER_BASE!,
]

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.BASE_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    from: Number(process.env.DISPATCHER_ADDRESS_BASE_START_BLOCK!),
  })
  .addTransaction({
    from: ADDRESSES,
  })
  .addTransaction({
    to: ADDRESSES,
  })

if (process.env.BASE_TXS_GATEWAY) {
  processor = processor.setGateway(process.env.BASE_TXS_GATEWAY)
}

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `base_txs_processor_${VERSION}`
  }),
  async (ctx) => {
    await handler(ctx)
  })
