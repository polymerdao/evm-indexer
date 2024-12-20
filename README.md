## Quickstart

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Clone the repo
git clone https://github.com/polymerdao/evm-indexer
cd evm-indexer

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
PROCESSOR_NAME=optimism sqd process # Optimism processor
PROCESSOR_NAME=base sqd process # Base processor
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
That error usually means that Subsquid's archival node is experiencing some issues.
If you don't do a huge backfill, set the affected chain gateway like `OPTIMISM_GATEWAY` to an empty string and restart the indexer.
Additionally, go to Subsquid's discord and open a support ticket like [this one](https://discord.com/channels/857105545135390731/1255998611716575263).


## Adding a New Chain for Indexing

To set up a new chain for indexing contracts and/or transactions, follow these steps:

1. Decide whether you want to track contracts, transactions, or both for the new chain.

2. Choose a unique processor name for your new chain (e.g., 'arbitrum', 'polygon'). This name will be used as the `PROCESSOR_NAME` environment variable.

3. Update the configuration file (specified by the `CONFIG_FILE` environment variable) to include the new chain. Add an entry for your chain with the relevant configuration:

   ```yaml
   {processorName}:
     contracts:
       - "0x1234567890123456789012345678901234567890"
     transactions:
       - "0x0987654321098765432109876543210987654321"
     rpc: "https://rpc.example.com"
     rpcRateLimit: 10
     maxBatchCallSize: 100
     gateway: "https://gateway.example.com"
     fromBlock: 1000000
     finalityConfirmation: 20
     version: 1
   ```

   All fields are optional and can be overridden by environment variables. Note that if both `contracts` and `transactions` are omitted in the config, the processor won't perform any actual work and will exit after starting.

4. Set the following environment variables for the new chain:

   - `PROCESSOR_NAME`: Set this to your chosen processor name
   - `CONFIG_FILE`: Path to the configuration file
   - `{PROCESSOR_NAME}_RPC`: The RPC endpoint for the new chain (overrides config)
   - `{PROCESSOR_NAME}_GATEWAY`: The gateway for the new chain (overrides config)
   - `DISPATCHER_ADDRESS_{PROCESSOR_NAME}_START_BLOCK`: The starting block number for indexing (overrides config's `fromBlock`)
   - `{PROCESSOR_NAME}_VERSION`: The version number for the processor state schema (overrides config)
   - `RPC_RATE_LIMIT`: Global RPC rate limit (can be overridden per chain)
   - `MAX_BATCH_CALL_SIZE`: Global max batch call size (can be overridden per chain)
   - `FINALITY_CONFIRMATION`: Global finality confirmation (can be overridden per chain)

   You can also set chain-specific overrides:
   - `{PROCESSOR_NAME}_RPC_RATE_LIMIT`: Custom RPC rate limit for this chain
   - `{PROCESSOR_NAME}_MAX_BATCH_CALL_SIZE`: Custom max batch call size for this chain

   Note: Environment variables take precedence over configuration file values.

5. To run the processor for the new chain, use the following command:

   ```bash
   PROCESSOR_NAME={processorName} sqd process
   ```

   This command will use the same processor code but with the configuration specific to the new chain.

6. Rebuild your squid to ensure all changes are compiled.

Remember to replace '{processorName}' and '{PROCESSOR_NAME}' with your actual unique processor name in all the above examples. The `ibc-processor.ts` utility will automatically set up the processor with the correct configuration based on the environment variables and the config file.

Note: This setup allows you to use the same processor code for multiple chains, simplifying maintenance and reducing code duplication. You only need to specify different `PROCESSOR_NAME` environment variables to run the processor for different chains.
