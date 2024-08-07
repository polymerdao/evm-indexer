import { TypeormDatabase } from '@subsquid/typeorm-store';
import { IbcProcessor } from '../utils/ibc-processor';
import { topics } from '../utils/topics';
import { handler } from '../handlers';
import { MAX_BATCH_CALL_SIZE, VERSION } from './constants';

const CONTRACTS: string[] = [
  process.env.DISPATCHER_ADDRESS_OPTIMISM!,
  process.env.UNIVERSAL_CHANNEL_ADDRESS_OPTIMISM!,
  process.env.FEE_VAULT_OPTIMISM!,
];

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .setBlockRange({
    // from: 11662566
    from: Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!),
  })
  .addLog({
    address: CONTRACTS,
    topic0: topics,
    transaction: true,
  });

if (process.env.OPTIMISM_GATEWAY) {
  processor = processor.setGateway(process.env.OPTIMISM_GATEWAY);
}

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: 'REPEATABLE READ',
    stateSchema: `optimism_processor_${VERSION}`,
  }),
  async (ctx) => {
    await handler(ctx);
  }
);
