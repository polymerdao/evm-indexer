import { TypeormDatabase } from '@subsquid/typeorm-store'
import { IbcProcessor } from '../utils/ibc-processor'
import { MAX_BATCH_CALL_SIZE, VERSION } from "./constants";
import { Transaction } from "../model";

const ADDRESSES: string[] = [
  process.env.BATCHER_ADDRESS!,
  process.env.PROPOSER_ADDRESS!,
]

let processor = IbcProcessor()
  .setRpcEndpoint({
    url: process.env.TXS_RPC!,
    rateLimit: Number(process.env.RPC_RATE_LIMIT!),
    maxBatchCallSize: MAX_BATCH_CALL_SIZE,
  })
  .addTransaction({
    from: ADDRESSES,
  })
  .addTransaction({
    to: ADDRESSES,
  })

if (process.env.TXS_GATEWAY) {
  processor = processor.setGateway(process.env.TXS_GATEWAY)
}

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    isolationLevel: "REPEATABLE READ",
    stateSchema: `txs_processor_${VERSION}`
  }),
  async (ctx) => {
    let chainId = Number(await ctx._chain.client.call("eth_chainId"))

    let txs: Transaction[] = []
    for (let block of ctx.blocks) {
      for (let tx of block.transactions) {
        txs.push(new Transaction({
          id: tx.hash,
          transactionHash: tx.hash,
          blockNumber: BigInt(block.header.height),
          blockTimestamp: BigInt(block.header.timestamp),
          chainId: chainId,
          from: tx.from,
          to: tx.to,
          value: BigInt(tx.value),
          gas: BigInt(tx.gas),
          gasPrice: BigInt(tx.gasPrice),
          maxFeePerGas: tx.maxFeePerGas ? BigInt(tx.maxFeePerGas) : null,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? BigInt(tx.maxPriorityFeePerGas) : null,
          gasUsed: BigInt(tx.gasUsed),
          cumulativeGasUsed: BigInt(tx.cumulativeGasUsed),
          transactionType: tx.type,
        }))
      }
    }

    await ctx.store.upsert(txs)
  })
