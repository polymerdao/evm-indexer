import { EvmBatchProcessor, } from '@subsquid/evm-processor'

export function IbcProcessor() {
  return new EvmBatchProcessor()
    .setFinalityConfirmation(Number(process.env.FINALITY_CONFIRMATION!))
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
    })
}

export function TxProcessor(addresses: string[]) {
  for (let address of addresses) {
    if (!address) {
      throw new Error(`One of the addresses is not set: ${addresses}`)
    }
  }

  return new EvmBatchProcessor()
    .setFinalityConfirmation(Number(process.env.FINALITY_CONFIRMATION!))
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
      },
      trace: {
        callFrom: true,
        callTo: true,
        callInput: true,
        callGas: true,
        callValue: true,
        callCallType: true,
        callResultGasUsed: true,
        callResultOutput: true,
      }
    })
    .addTrace({
      callTo: addresses,
      type: ["call"],
      transaction: true,
    })
    .addTransaction({
      from: addresses,
    })
    .addTransaction({
      to: addresses,
      traces: true
    })
}

