import process from "process";
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { IbcExtension, QueryClient, setupIbcExtension } from '@cosmjs/stargate';

export class TmClient {
  private static instance: Promise<QueryClient & IbcExtension> | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static async getInstance(): Promise<QueryClient & IbcExtension> {
    if (!TmClient.instance) {
      TmClient.instance = TmClient.createInstance();
    }
    return TmClient.instance;
  }

  private static async createInstance(): Promise<QueryClient & IbcExtension> {
    const tmClient = await Tendermint37Client.connect(process.env.API_URL!);
    return QueryClient.withExtensions(tmClient, setupIbcExtension);
  }
}

export const DISPATCHER_CLIENT = {
  [process.env.DISPATCHER_ADDRESS_OPTIMISM!]: process.env.OPTIMISM_CLIENT_NAME,
  [process.env.DISPATCHER_ADDRESS_BASE!]: process.env.BASE_CLIENT_NAME,
  [process.env.DISPATCHER_ADDRESS_OPTIMISM_SIMCLIENT!]: process.env.OPTIMISM_CLIENT_SIMCLIENT_NAME,
  [process.env.DISPATCHER_ADDRESS_BASE_SIMCLIENT!]: process.env.BASE_CLIENT_SIMCLIENT_NAME,
}