import { createConfig } from "@ponder/core";
import { http } from "viem";

import { DispatcherAbi } from "./abis/Dispatcher";

function mustAddress(value?: string): `0x${string}` {
  // value starts with 0x
  if (!value) {
    throw new Error("Address is required");
  }

  // extract the address without 0x
  const address = value.slice(2);
  if (address.length !== 40) {
    throw new Error("Invalid address");
  }
  return `0x${address}`;
}

function mustInt(val?: string) {
  if (!val) {
    throw new Error("Value is required");
  }
  return parseInt(val);
}

export default createConfig({
  networks: {
    base: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532),
      pollingInterval: 5_000,
    },
    optimism: {
      chainId: 11155420,
      transport: http(process.env.PONDER_RPC_URL_11155420),
      pollingInterval: 5_000,
    },
    molten: {
      chainId: 49483,
      transport: http(process.env.PONDER_RPC_URL_49483),
      pollingInterval: 5_000,
    },
  },
  contracts: {
    sim: {
      abi: DispatcherAbi,
      network: {
        base: {
          address: mustAddress(process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT),
          startBlock: mustInt(process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT_START_BLOCK),
        },
        optimism: {
          address: mustAddress(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT),
          startBlock: mustInt(process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT_START_BLOCK),
        },
      },
    },
    proof: {
      abi: DispatcherAbi,
      network: {
        base: {
          address: mustAddress(process.env.DISPATCHER_ADDRESS_BASE),
          startBlock: mustInt(process.env.DISPATCHER_ADDRESS_BASE_START_BLOCK),
        },
        optimism: {
          address: mustAddress(process.env.DISPATCHER_ADDRESS_OPTIMISM),
          startBlock: mustInt(process.env.DISPATCHER_ADDRESS_OPTIMISM_START_BLOCK),
        },
      },
    },
  },
});
