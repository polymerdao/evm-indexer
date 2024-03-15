import { createConfig } from "@ponder/core";
import { http, createPublicClient } from "viem";

import { DispatcherAbi } from "./abis/Dispatcher";

const latestBlockBase = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_8453),
}).getBlock();
const latestBlockOptimism = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_10),
}).getBlock();


export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
      pollingInterval: 15_000,
    },
    base: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532),
      pollingInterval: 15_000,
    },
    optimism: {
      chainId: 11155420,
      transport: http(process.env.PONDER_RPC_URL_11155420),
      pollingInterval: 15_000,
    },
  },
  contracts: {
    DispatcherSim: {
      abi: DispatcherAbi,
      network: {
        base: {
          address: "0x0dE926fE2001B2c96e9cA6b79089CEB276325E9F",
          startBlock: 6769996,
        },
        optimism: {
          address: "0x6C9427E8d770Ad9e5a493D201280Cc178125CEc0",
          startBlock: 8752864,
        },
      },
    },
    DispatcherProof: {
      abi: DispatcherAbi,
      network: {
        base: {
          address: "0xfC1d3E02e00e0077628e8Cc9edb6812F95Db05dC",
          startBlock: 6778793,
        },
        optimism: {
          address: "0x58f1863F75c9Db1c7266dC3d7b43832b58f35e83",
          startBlock: 8761661,
        },
      },
    },
  },
});
