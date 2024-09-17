import { EvmBatchProcessor } from '@subsquid/evm-processor'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { z } from "zod";
import { topics } from "./topics";
import { Context } from "./types";
import { TypeormDatabase } from "@subsquid/typeorm-store";

const ConfigSchema = z.record(z.string(),
  z.object({
    transactions: z.array(z.string()),
    contracts: z.array(z.string()),
  }))

type Config = z.infer<typeof ConfigSchema>

export function IbcProcessor(processorName: string) {
  processorName = processorName.toUpperCase();

  // Read the config file
  const configPath = process.env.CONFIG_FILE
  if (!configPath) {
    throw new Error('CONFIG_FILE environment variable is not set')
  }

  let config: Config
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8')
    config = ConfigSchema.parse(yaml.load(fileContents))
  } catch (error) {
    throw new Error(`Failed to read or parse config file: ${error}`)
  }

  let processor = new EvmBatchProcessor()
    .setFields({
      block: {
        timestamp: true
      },
      log: {
        transaction: true,
        transactionHash: true,
      },
      transaction: {
        input: true,
        chainId: true,
        gas: true,
        gasPrice: true,
        maxFeePerGas: true,
        maxPriorityFeePerGas: true,
        gasUsed: true,
        cumulativeGasUsed: true,
        from: true,
        type: true,
        value: true,
        status: true,
      }
    });

  let rpcUrl = process.env[`${processorName}_RPC`]
  if (!rpcUrl) {
    throw new Error(`Missing RPC endpoint for chain ${processorName}`)
  }

  let rpcRateLimit = process.env.RPC_RATE_LIMIT

  if (!rpcRateLimit) {
    throw new Error(`Missing RPC rate limit env var`)
  }

  let customRateLimit = process.env[`${processorName}_RPC_RATE_LIMIT`]
  if (customRateLimit) {
    rpcRateLimit = customRateLimit
  }

  let maxBatchCallSize = process.env.MAX_BATCH_CALL_SIZE ?? "100"
  if (!maxBatchCallSize) {
    throw new Error(`Missing max batch call size env var`)
  }

  let customMaxBatchCallSize = process.env[`${processorName}_MAX_BATCH_CALL_SIZE`]
  if (customMaxBatchCallSize) {
    maxBatchCallSize = customMaxBatchCallSize
  }

  processor = processor.setRpcEndpoint({
    url: rpcUrl,
    rateLimit: Number(rpcRateLimit),
    maxBatchCallSize: Number(maxBatchCallSize),
  })

  let gateway = process.env[`${processorName}_GATEWAY`]
  if (gateway) {
    processor = processor.setGateway(gateway)
  }

  let fromBlock = process.env[`DISPATCHER_ADDRESS_${processorName}_START_BLOCK`]
  if (!fromBlock) {
    processor = processor.setBlockRange({
      from: Number(fromBlock),
    })
  }

  let finalityConfirmation = process.env.FINALITY_CONFIRMATION;
  if (finalityConfirmation) {
    processor = processor.setFinalityConfirmation(Number(finalityConfirmation))
  }

  if (config[processorName]) {
    if (config[processorName].transactions) {
      processor = processor.addTransaction({
        from: config[processorName].transactions
      })
      processor = processor.addTransaction({
        to: config[processorName].transactions
      })
    }

    if (config[processorName].contracts) {
      processor = processor.addLog({
        address: config[processorName].contracts,
        transaction: true,
        topic0: topics,
      })
    }
  }

  return processor
}

export function runProcessor(processorName: string, handler: (ctx: Context) => Promise<void>) {
  const processor = IbcProcessor(processorName)

  let version = process.env[`${processorName.toUpperCase()}_VERSION`] ?? '1';
  processor.run(new TypeormDatabase({
      supportHotBlocks: true,
      isolationLevel: "REPEATABLE READ",
      stateSchema: `${processorName}_processor_${version}`
    }),
    async (ctx) => {
      await handler(ctx)
    })
}