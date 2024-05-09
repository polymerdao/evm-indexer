import {
  EvmBatchProcessor,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'

export function IbcProcessor() {
  return new EvmBatchProcessor()
    .setFinalityConfirmation(Number(process.env.FINALITY_CONFIRMATION!))
    .setFields({
      log: {
        transactionHash: true
      },
      transaction: {
        chainId: true,
        gas: true,
      }
    })
}
