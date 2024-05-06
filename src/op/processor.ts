import { EvmBatchProcessor } from '@subsquid/evm-processor'
import * as Dispatcher from '../abi/dispatcher'
import { DispatcherInfo } from '../handlers/handlers'

export const DISPATCHERS: DispatcherInfo[] = [
  { name: "optimism-proofs-1", address: process.env.DISPATCHER_ADDRESS_OPTIMISM!, type: "proofs" },
  { name: "optimism-sim", address: process.env.DISPATCHER_ADDRESS_OPTIMISM_SIM!, type: "sim" }
]

export const processor = new EvmBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/optimism-sepolia')
  .setRpcEndpoint({
    url: process.env.OPTIMISM_RPC!,
    rateLimit: 10
  })
  .setFinalityConfirmation(90)

  // Fields should mirror ibc-processor.ts
  .setFields({
    log: {
      transactionHash: true
    },
    transaction: {
      gas: true,
      chainId: true
    }
  })
  .setBlockRange({
    from: Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK!)
  })
  .addLog({
    address: [process.env.DISPATCHER_ADDRESS_OPTIMISM!],
    topic0: [Dispatcher.events.SendPacket.topic]
  })
  .setBlockRange({
    from: Number(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT_START_BLOCK!)
  })
  .addLog({
    address: [process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT!],
    topic0: [Dispatcher.events.SendPacket.topic]
  })
