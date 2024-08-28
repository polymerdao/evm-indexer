import { TraceContext } from "../utils/types";
import { Transaction } from "../model";

export async function handler(ctx: TraceContext) {
  let chainId = Number(await ctx._chain.client.call("eth_chainId"))

  let txs: Transaction[] = []
  for (let block of ctx.blocks) {
    for (let tx of block.transactions) {
      let value = BigInt(tx.value);
      let gas = BigInt(tx.gas);
      let gasUsed = BigInt(tx.gasUsed);

      // assume that there is only one relevant trace
      if (tx.traces.length == 1) {
        if (tx.traces[0].type == "call") {
          let trace = tx.traces[0]
          if (trace.action.value) {
            value = trace.action.value
          }
          gas = trace.action.gas
          if (trace.result) {
            gasUsed = trace.result.gasUsed
          }
        }
      } else if (tx.traces.length > 1) {
        // assumption is broken, let's fail fast and investigate
        throw new Error(`Multiple traces for tx ${tx.hash}`)
      }

      txs.push(new Transaction({
        id: tx.hash,
        transactionHash: tx.hash,
        blockNumber: BigInt(block.header.height),
        blockTimestamp: BigInt(block.header.timestamp),
        chainId: chainId,
        from: tx.from,
        to: tx.to,
        value: value ,
        gas: gas,
        gasPrice: BigInt(tx.gasPrice),
        maxFeePerGas: tx.maxFeePerGas ? BigInt(tx.maxFeePerGas) : null,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? BigInt(tx.maxPriorityFeePerGas) : null,
        gasUsed: gasUsed,
        cumulativeGasUsed: BigInt(tx.cumulativeGasUsed),
        transactionType: tx.type,
      }))
    }
  }

  await ctx.store.upsert(txs)
}