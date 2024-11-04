import { EvmBatchProcessor } from '@subsquid/evm-processor'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { z } from "zod";
import { topics } from "./topics";
import { Context } from "./types";
import { TypeormDatabase } from "@subsquid/typeorm-store";

const ConfigSchema = z.record(z.string(),
  z.object({
    transactions: z.array(z.string()).optional(),
    contracts: z.array(z.string()).optional(),
    rpc: z.string().optional(),
    rpcRateLimit: z.number().optional(),
    maxBatchCallSize: z.number().optional(),
    gateway: z.string().optional(),
    fromBlock: z.number().optional(),
    finalityConfirmation: z.number().optional(),
    version: z.number().default(1).optional(),
  }))

type Config = z.infer<typeof ConfigSchema>

export function IbcProcessor(processorName?: string) {
  if (!processorName) {
    processorName = process.env.PROCESSOR_NAME
  }

  if (!processorName) {
    throw new Error('PROCESSOR_NAME environment variable is not set')
  }

  let capProcessorName = processorName.toUpperCase();

  // Read the config file
  const configPath = process.env.CONFIG_FILE
  if (!configPath) {
    throw new Error('CONFIG_FILE environment variable is not set')
  }

  let config: Config
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8')
    const interpolatedFileContents = fileContents.replace(/\$\{([A-Z0-9_]+)}/g, (match, p1) => {
      return process.env[p1] !== undefined ? String(process.env[p1]) : match; // Replace with env var value (even if empty), or keep the placeholder if not found
    });
    const interpolatedConfig = yaml.load(interpolatedFileContents) as Record<string, any>
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

  let rpcUrl = config[processorName]?.rpc ?? process.env[`${capProcessorName}_RPC`]
  if (!rpcUrl) {
    throw new Error(`Missing RPC endpoint for chain ${capProcessorName}`)
  }

  let rpcRateLimit = config[processorName]?.rpcRateLimit ?? Number(process.env.RPC_RATE_LIMIT)
  if (rpcRateLimit === undefined) {
    throw new Error(`Missing RPC rate limit`)
  }

  let customRateLimit = Number(process.env[`${capProcessorName}_RPC_RATE_LIMIT`])
  if (!isNaN(customRateLimit)) {
    rpcRateLimit = customRateLimit
  }

  let maxBatchCallSize = config[processorName]?.maxBatchCallSize ?? Number(process.env.MAX_BATCH_CALL_SIZE ?? "100")
  if (maxBatchCallSize === undefined) {
    throw new Error(`Missing max batch call size`)
  }

  let customMaxBatchCallSize = Number(process.env[`${capProcessorName}_MAX_BATCH_CALL_SIZE`])
  if (!isNaN(customMaxBatchCallSize)) {
    maxBatchCallSize = customMaxBatchCallSize
  }

  processor = processor.setRpcEndpoint({
    url: rpcUrl,
    rateLimit: rpcRateLimit,
    maxBatchCallSize: maxBatchCallSize,
  })

  let gateway = config[processorName]?.gateway ?? process.env[`${capProcessorName}_GATEWAY`]
  if (gateway) {
    processor = processor.setGateway(gateway)
  }

  let fromBlock = config[processorName]?.fromBlock ?? Number(process.env[`DISPATCHER_ADDRESS_${capProcessorName}_START_BLOCK`])
  if (fromBlock) {
    processor = processor.setBlockRange({
      from: fromBlock,
    })
  }

  let finalityConfirmation = config[processorName]?.finalityConfirmation ?? Number(process.env.FINALITY_CONFIRMATION);
  if (finalityConfirmation) {
    processor = processor.setFinalityConfirmation(finalityConfirmation)
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

  return {processor, processorName, config}
}

export function runProcessor(handler: (ctx: Context) => Promise<void>) {
  const {processor, processorName, config} = IbcProcessor()

  let version = process.env[`${processorName.toUpperCase()}_VERSION`] ?? config.version ?? 1;
  if (!version) {
    throw new Error('Version not set')
  }

  processor.run(new TypeormDatabase({
      supportHotBlocks: true,
      isolationLevel: "REPEATABLE READ",
      stateSchema: `${processorName}_processor_${version}`
    }),
    async (ctx) => {
      await handler(ctx)
    })
}