import { EvmBatchProcessor } from '@subsquid/evm-processor'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { z } from "zod";
import { topics } from "./topics";
import { Context } from "./types";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import dotenvExpand from 'dotenv-expand';

const ConfigSchema = z.record(z.string(),
  z.object({
    transactions: z.array(z.string()).optional(),
    contracts: z.array(z.string()).optional(),
  }))

type Config = z.infer<typeof ConfigSchema>

export function IbcProcessor(processorName: string) {
  let capProcessorName = processorName.toUpperCase();

  // Read the config file
  const configPath = process.env.CONFIG_FILE
  if (!configPath) {
    throw new Error('CONFIG_FILE environment variable is not set')
  }

  let config: Config
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8')
    const rawConfig = yaml.load(fileContents) as Record<string, any>

    // Interpolate environment variables
    const interpolatedConfig = Object.entries(rawConfig).reduce((acc, [key, value]) => {
      acc[key] = {
        transactions: value.transactions?.map((t: string) => dotenvExpand.expand({ parsed: { VALUE: t } }).parsed!.VALUE),
        contracts: value.contracts?.map((c: string) => dotenvExpand.expand({ parsed: { VALUE: c } }).parsed!.VALUE),
      }
      return acc
    }, {} as Record<string, any>)
    
    config = ConfigSchema.parse(interpolatedConfig)
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

  let rpcUrl = process.env[`${capProcessorName}_RPC`]
  if (!rpcUrl) {
    throw new Error(`Missing RPC endpoint for chain ${capProcessorName}`)
  }

  let rpcRateLimit = process.env.RPC_RATE_LIMIT

  if (!rpcRateLimit) {
    throw new Error(`Missing RPC rate limit env var`)
  }

  let customRateLimit = process.env[`${capProcessorName}_RPC_RATE_LIMIT`]
  if (customRateLimit) {
    rpcRateLimit = customRateLimit
  }

  let maxBatchCallSize = process.env.MAX_BATCH_CALL_SIZE ?? "100"
  if (!maxBatchCallSize) {
    throw new Error(`Missing max batch call size env var`)
  }

  let customMaxBatchCallSize = process.env[`${capProcessorName}_MAX_BATCH_CALL_SIZE`]
  if (customMaxBatchCallSize) {
    maxBatchCallSize = customMaxBatchCallSize
  }

  processor = processor.setRpcEndpoint({
    url: rpcUrl,
    rateLimit: Number(rpcRateLimit),
    maxBatchCallSize: Number(maxBatchCallSize),
  })

  let gateway = process.env[`${capProcessorName}_GATEWAY`]
  if (gateway) {
    processor = processor.setGateway(gateway)
  }

  let fromBlock = process.env[`DISPATCHER_ADDRESS_${capProcessorName}_START_BLOCK`]
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