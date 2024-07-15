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