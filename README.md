# Multichain transfers squid

This [squid](https://docs.subsquid.io/) captures USDC Transfer events on ETH and BSC, stores them in the same database and serves the data over a common GraphQL API.

The Ethereum processor is located in `src/eth` and similarly the Binance Chain processor can be found in `src/bsc`. The scripts file `commands.json` was updated with the commands `process:eth` and `process:bsc` to run the processors. 

You can find some useful hints on developing multichain squids on the [dedicated documentation page](https://docs.subsquid.io/basics/multichain/).

Dependencies: Node.js, Docker, Git.

## Quickstart

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Clone the repo
git clone https://github.com/subsquid-labs/multichain-transfers-example
cd multichain-transfers-example

# 2. Install dependencies
npm ci

# 3. Start a Postgres database container and detach
sqd up

# 4. Apply the migration
sqd migration:apply

# 5. Build the squid
sqd build

# 6. Run all services at once
sqd run .
```
A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

You can also run individual services separately:
```bash
sqd process:eth # Ethereum processor
sqd process:bsc # BSC processor
sqd serve       # GraphQL server
```

## Database migration
After making a change to the graphql schema a migration needs to be generated.
```bash
npm run build
# apply existing migrations so that only new migrations are generated
npx squid-typeorm-migration apply
npx squid-typeorm-migration generate
npx squid-typeorm-migration apply
```

## Troubleshooting

### TypeError: Cannot read properties of undefined (reading 'toLowerCase')
```bash
    at /squid/node_modules/@subsquid/evm-processor/lib/processor.js:437:39
    at Array.map (<anonymous>)
    at mapRequest (/squid/node_modules/@subsquid/evm-processor/lib/processor.js:437:28)
    at EvmBatchProcessor.addLog (/squid/node_modules/@subsquid/evm-processor/lib/processor.js:195:20)
    at Object.<anonymous> (/squid/lib/chains/optimism.js:24:6)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
```
That is likely caused by missing some env vars like `DISPATCHER_ADDRESS_BASE` or `UNIVERSAL_CHANNEL_ADDRESS_OPTIMISM`.
Check that you have all the required env vars set in your runtime.

### Not ready to serve block N of dataset X
That error usually means that Subsquid's acrhival node is experiencing some issues.
If you don't do a huge backfill, set the affected chain gateway like `OPTIMISM_GATEWAY` to an empty string and restart the indexer.
Additionally, go to Subsquid's discord and open a support ticket like [this one](https://discord.com/channels/857105545135390731/1255998611716575263).


## Adding a New Chain for Indexing

To set up a new chain for indexing contracts and/or transactions, follow these steps:

1. Decide whether you want to track contracts, transactions, or both for the new chain.

2. Choose a unique processor name for your new chain (e.g., 'arbitrum', 'polygon'). This name will be used throughout the setup process. Create a new file in the appropriate directory:
   - For contracts: `src/chains/contracts/{processorName}.ts`
   - For transactions: `src/chains/wallets/{processorName}.ts`

3. In this new file, import the necessary functions and handler:

   For contracts:
   ```typescript
   import { runProcessor } from "../../utils/ibc-processor";
   import { handler } from "../../handlers";

   runProcessor('{processorName}', handler)
   ```

   For transactions:
   ```typescript
   import { runProcessor } from '../../utils/ibc-processor'
   import { handler } from "../../handlers/wallets";

   runProcessor('{processorName}_txs', handler)
   ```

   Replace '{processorName}' with your chosen unique processor name.

4. Update the configuration file (specified by the `CONFIG_FILE` environment variable) to include the new chain. Add an entry for your chain with the relevant contracts and/or transaction addresses:

   ```yaml
   {PROCESSOR_NAME}:
     contracts:
       - "0x1234567890123456789012345678901234567890"
     transactions:
       - "0x0987654321098765432109876543210987654321"
   ```

5. Set the following environment variables for the new chain:

   - `{PROCESSOR_NAME}_RPC`: The RPC endpoint for the new chain
   - `{PROCESSOR_NAME}_GATEWAY`: (Optional) The gateway for the new chain
   - `DISPATCHER_ADDRESS_{PROCESSOR_NAME}_START_BLOCK`: The starting block number for indexing
   - `{PROCESSOR_NAME}_VERSION`: (Optional) The version number for the processor state schema

   You can also set custom rate limits and batch call sizes:
   - `{PROCESSOR_NAME}_RPC_RATE_LIMIT`: Custom RPC rate limit for this chain
   - `{PROCESSOR_NAME}_MAX_BATCH_CALL_SIZE`: Custom max batch call size for this chain

6. If needed, update the appropriate handler file:
   - For contracts: `src/handlers/index.ts`
   - For transactions: `src/handlers/wallets.ts`
   Include any chain-specific logic in the handler function.

7. Add new squid commands for the new chain in the `commands.json` file:

   For contracts:
   ```json
   "process:{processorName}": {
     "description": "Load .env and start the {ProcessorName} squid processor",
     "deps": ["build", "migration:apply"],
     "cmd": ["node", "--require=dotenv/config", "lib/chains/contracts/{processorName}.js"]
   },
   "process:prod:{processorName}": {
     "description": "Start the {ProcessorName} squid processor",
     "cmd": ["node", "lib/chains/contracts/{processorName}.js"],
     "hidden": true
   }
   ```

   For transactions:
   ```json
   "process:{processorName}:wallets": {
     "description": "Load .env and start the {ProcessorName} Wallets squid processor",
     "deps": ["build", "migration:apply"],
     "cmd": ["node", "--require=dotenv/config", "lib/chains/wallets/{processorName}.js"]
   },
   "process:prod:{processorName}:wallets": {
     "description": "Start the {ProcessorName} Wallets squid processor",
     "cmd": ["node", "lib/chains/wallets/{processorName}.js"],
     "hidden": true
   }
   ```

   Replace '{processorName}' with your chosen unique processor name and '{ProcessorName}' with a capitalized version.

8. Rebuild and restart your squid to include the new chain in the indexing process.

Remember to replace '{processorName}' and '{PROCESSOR_NAME}' with your actual unique processor name in all the above examples. The `ibc-processor.ts` utility will automatically set up the processor with the correct configuration based on the environment variables and the config file.

Note: If you're tracking both contracts and transactions for the new chain, you'll need to create two separate files (one in each directory) and set up both processors and commands.