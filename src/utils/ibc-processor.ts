import {
  EvmBatchProcessor,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'

export function IbcProcessor() {
  return new EvmBatchProcessor()
    .setFinalityConfirmation(Number(process.env.FINALITY_CONFIRMATION!))
    .setFields({
      block: {
        timestamp: true
      },
      log: {
        transaction: true,
        transactionHash: true
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
      }
    })
}
