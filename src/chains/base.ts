import { TypeormDatabase } from '@subsquid/typeorm-store';
import { IbcProcessor } from '../utils/ibc-processor';
import { topics } from '../utils/topics';
import { handler } from '../handlers';
import { MAX_BATCH_CALL_SIZE, VERSION } from './constants';

const CONTRACTS: string[] = [
  process.env.DISPATCHER_ADDRESS_BASE!,
  process.env.UNIVERSAL_CHANNEL_ADDRESS_BASE!,
  process.env.FEE_VAULT_BASE!,
];

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.BASE_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    // from: 9676707
    from: Math.min(Number(process.env.DISPATCHER_ADDRESS_BASE_START_BLOCK!)),
  })
  .addLog({
    address: CONTRACTS,
    topic0: topics,
    transaction: true,
  });

if (process.env.BASE_GATEWAY) {
  processor = processor.setGateway(process.env.BASE_GATEWAY);
}

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: 'REPEATABLE READ',
    stateSchema: `base_processor_${VERSION}`,
  }),
  async (ctx) => {
    await handler(ctx);
  }
);
