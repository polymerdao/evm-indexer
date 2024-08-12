import { Context } from "../utils/types";
import { Transaction } from "../model";

export async function handler(ctx: Context) {
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
}